#!/bin/bash

# Find all VS Code related processes and move them to vscode.slice
for pid in $(ps aux | grep -i vscode | grep -v grep | awk "{print \$2}"); do
  if [ -d /proc/$pid ]; then
    echo "Moving VS Code process $pid to vscode.slice"
    echo $pid > /sys/fs/cgroup/vscode.slice/cgroup.procs 2>/dev/null || true
  fi
done
