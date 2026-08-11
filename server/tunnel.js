import net from 'net';
import { Client } from 'ssh2';
import dotenv from 'dotenv';

dotenv.config();

export function createSshTunnel() {
  return new Promise((resolve, reject) => {
    const sshHost = process.env.SSH_HOST;
    if (!sshHost) {
      console.log('No SSH_HOST configured, bypassing SSH tunnel.');
      return resolve(null);
    }

    const sshUser = process.env.SSH_USER || 'neha_developer';
    const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';
    const sshPort = parseInt(process.env.SSH_PORT || '22', 10);
    const localPort = parseInt(process.env.DB_PORT || '5433', 10);
    const remoteDbPort = 5432; // Default remote PostgreSQL port

    console.log(`Establishing SSH Tunnel to ${sshUser}@${sshHost}:${sshPort}...`);

    const sshClient = new Client();

    sshClient.on('ready', () => {
      console.log(`SSH Connection established with ${sshHost}!`);

      const server = net.createServer((socket) => {
        sshClient.forwardOut(
          '127.0.0.1',
          socket.remotePort,
          '127.0.0.1',
          remoteDbPort,
          (err, stream) => {
            if (err) {
              console.error('SSH Port Forwarding Error:', err.message);
              socket.end();
              return;
            }
            socket.pipe(stream).pipe(socket);
          }
        );
      });

      server.listen(localPort, '127.0.0.1', () => {
        console.log(`SSH Tunnel listening locally on 127.0.0.1:${localPort} -> remote 127.0.0.1:${remoteDbPort}`);
        resolve({ server, sshClient });
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Local port ${localPort} already in use, reusing existing listener/tunnel.`);
          resolve({ server: null, sshClient });
        } else {
          console.error('Local tunnel server error:', err.message);
          reject(err);
        }
      });
    });

    sshClient.on('error', (err) => {
      console.error('SSH Tunnel Authentication/Connection Error:', err.message);
      // Resolve null so app can fallback if SSH host is unreachable locally
      resolve(null);
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
