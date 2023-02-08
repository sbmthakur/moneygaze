#!/bin/bash
# use this to verify journal mode after app startup ( should print wal)
sqlite3 prisma/dev.db "PRAGMA journal_mode"
