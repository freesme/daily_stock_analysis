const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const net = require('net');
const http = require('http');

let mainWindow = null;
let backendProcess = null;
let logFilePath = null;

const isWindows = process.platform === 'win32';
const appRootDev = path.resolve(__dirname, '..', '..');

function resolveEnvExamplePath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, '.env.example');
  }
  return path.join(appRootDev, '.env.example');
}

function resolveAppDir() {
  if (app.isPackaged) {
    // exe 所在目录
    return path.dirname(app.getPath('exe'));
  }
  return app.getPath('userData');
}

function resolveBackendPath() {
  if (process.env.DSA_BACKEND_PATH) {
    return process.env.DSA_BACKEND_PATH;
  }

  if (app.isPackaged) {
    const backendDir = path.join(process.resourcesPath, 'backend');
    const exeName = isWindows ? 'stock_analysis.exe' : 'stock_analysis';
    return path.join(backendDir, exeName);
  }

  return null;
}

function initLogging() {
  const appDir = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getPath('userData');
  logFilePath = path.join(appDir, 'logs', 'desktop.log');
  
  // 确保日志目录存在
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  logLine('Desktop app starting');
}

function logLine(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  try {
    if (logFilePath) {
      fs.appendFileSync(logFilePath, line, 'utf-8');
    }
  } catch (error) {
    console.error(error);
  }
  console.log(line.trim());
}

function resolvePythonPath() {
  return process.env.DSA_PYTHON || 'python';
}

function ensureEnvFile(envPath) {
  if (fs.existsSync(envPath)) {
    return;
  }

  const envExample = resolveEnvExamplePath();
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envPath);
    return;
  }

  fs.writeFileSync(envPath, '# Configure your API keys and stock list here.\n', 'utf-8');
}

function findAvailablePort(startPort = 8000, endPort = 8100) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      if (port > endPort) {
        reject(new Error('No available port'));
        return;
      }

      const server = net.createServer();
      server.once('error', () => {
        tryPort(port + 1);
      });
      server.once('listening', () => {
        server.close(() => resolve(port));
      });
      server.listen(port, '127.0.0.1');
    };

    tryPort(startPort);
  });
}

function waitForHealth(url, timeoutMs = 60000, intervalMs = 250) {
  const start = Date.now();
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      attempts += 1;
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve({ elapsedMs: Date.now() - start, attempts });
          return;
        }
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Health check failed: ${res.statusCode}`));
          return;
        }
        setTimeout(attempt, intervalMs);
      });

      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Health check timeout'));
          return;
        }
        setTimeout(attempt, intervalMs);
      });
    };

    attempt();
  });
}

function startBackend({ port, envFile, dbPath, logDir }) {
  const backendPath = resolveBackendPath();
  const env = {
    ...process.env,
    DSA_DESKTOP_MODE: 'true',
    ENV_FILE: envFile,
    DATABASE_PATH: dbPath,
    LOG_DIR: logDir,
    PYTHONUTF8: '1',
    SCHEDULE_ENABLED: 'false',
    WEBUI_ENABLED: 'false',
    BOT_ENABLED: 'false',
    DINGTALK_STREAM_ENABLED: 'false',
    FEISHU_STREAM_ENABLED: 'false',
  };

  const args = ['--serve-only', '--host', '127.0.0.1', '--port', String(port)];

  if (backendPath) {
    if (!fs.existsSync(backendPath)) {
      throw new Error(`Backend executable not found: ${backendPath}`);
    }
    backendProcess = spawn(backendPath, args, {
      env,
      cwd: path.dirname(backendPath),
      stdio: 'pipe',
      windowsHide: true,
    });
  } else {
    const pythonPath = resolvePythonPath();
    const scriptPath = path.join(appRootDev, 'main.py');
    backendProcess = spawn(pythonPath, [scriptPath, ...args], {
      env,
      cwd: appRootDev,
      stdio: 'pipe',
      windowsHide: true,
    });
  }

  if (backendProcess) {
    backendProcess.stdout.on('data', (data) => {
      logLine(`[backend] ${String(data).trim()}`);
    });
    backendProcess.stderr.on('data', (data) => {
      logLine(`[backend] ${String(data).trim()}`);
    });
    backendProcess.on('exit', (code) => {
      logLine(`[backend] exited with code ${code}`);
    });
  }
}

function stopBackend() {
  if (!backendProcess || backendProcess.killed) {
    return;
  }

  if (isWindows) {
    spawn('taskkill', ['/PID', String(backendProcess.pid), '/T', '/F']);
    return;
  }

  backendProcess.kill('SIGTERM');
  setTimeout(() => {
    if (!backendProcess.killed) {
      backendProcess.kill('SIGKILL');
    }
  }, 3000);
}

async function createWindow() {
  initLogging();
  const startupStartedAt = Date.now();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const loadingPath = path.join(__dirname, 'renderer', 'loading.html');
  await mainWindow.loadFile(loadingPath);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const appDir = resolveAppDir();
  const envPath = path.join(appDir, '.env');
  ensureEnvFile(envPath);

  const port = await findAvailablePort(8000, 8100);
  logLine(`Using port ${port}`);
  logLine(`ENV_FILE=${envPath}`);
  logLine(`App directory=${appDir}`);

  const dbPath = path.join(appDir, 'data', 'stock_analysis.db');
  const logDir = path.join(appDir, 'logs');

  try {
    startBackend({ port, envFile: envPath, dbPath, logDir });
    logLine('Backend process started, waiting for health check');
  } catch (error) {
    logLine(String(error));
    const errorUrl = `file://${loadingPath}?error=${encodeURIComponent(String(error))}`;
    await mainWindow.loadURL(errorUrl);
    return;
  }

  const healthUrl = `http://127.0.0.1:${port}/api/health`;
  try {
    const healthInfo = await waitForHealth(healthUrl);
    logLine(`Backend ready in ${healthInfo.elapsedMs}ms (${healthInfo.attempts} probes)`);
    await mainWindow.loadURL(`http://127.0.0.1:${port}/`);
    logLine(`Main UI loaded in ${Date.now() - startupStartedAt}ms`);
  } catch (error) {
    logLine(String(error));
    const errorUrl = `file://${loadingPath}?error=${encodeURIComponent(String(error))}`;
    await mainWindow.loadURL(errorUrl);
  }
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});
