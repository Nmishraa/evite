import net from 'net';
import { Client } from 'ssh2';
import dotenv from 'dotenv';

dotenv.config();

export function createSshTunnel() {
  return new Promise((resolve, reject) => {
    const sshHost = process.env.SSH_HOST || '2.24.200.44';
    const sshUser = process.env.SSH_USER || 'neha_developer';
    const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';
    const sshPort = parseInt(process.env.SSH_PORT || '22', 10);
    const localTunnelPort = parseInt(process.env.TUNNEL_PORT || '54333', 10);
    const remoteDbPort = 5432;

    console.log(`[SSH Tunnel] Opening SSH connection to ${sshUser}@${sshHost}:${sshPort}...`);

    const sshClient = new Client();

    sshClient.on('ready', () => {
      console.log(`[SSH Tunnel] SSH connection to ${sshHost} ESTABLISHED!`);

      const server = net.createServer((socket) => {
        sshClient.forwardOut(
          '127.0.0.1',
          socket.remotePort,
          '127.0.0.1',
          remoteDbPort,
          (err, stream) => {
            if (err) {
              console.error('[SSH Tunnel] ForwardOut error:', err.message);
              socket.end();
              return;
            }
            socket.pipe(stream).pipe(socket);
          }
        );
      });

      server.listen(localTunnelPort, '127.0.0.1', () => {
        console.log(`[SSH Tunnel] Listening on 127.0.0.1:${localTunnelPort} -> forwarding to remote DB server 2.24.200.44:5432`);
        resolve({ server, sshClient });
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`[SSH Tunnel] Port ${localTunnelPort} already active, forwarding via active SSH tunnel.`);
          resolve({ server: null, sshClient });
        } else {
          console.error('[SSH Tunnel] Server error:', err.message);
          reject(err);
        }
      });
    });

    sshClient.on('error', (err) => {
      console.error('[SSH Tunnel] Authentication/Connection failed:', err.message);
      reject(err);
    });

    sshClient.connect({
      host: sshHost,
      port: sshPort,
      username: sshUser,
      password: sshPassword,
      readyTimeout: 10000,
    });
  });
}
