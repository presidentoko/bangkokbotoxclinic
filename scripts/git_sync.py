"""Commit one data file and get it onto origin, without leaking stashes.

The price samplers used to do this by hand:

    git stash                       # the WHOLE working tree, not just their file
    git pull --rebase
    git stash pop                   # capture_output=True, return code ignored

Three problems, all of which actually happened. The blanket stash swept up ~200
files belonging to other pipelines. When `pop` hit a conflict the failure was
swallowed and the entry stayed behind — 31 stashes had accumulated by
2026-08-19, the oldest from May. And a failed rebase left the repo mid-rebase on
a detached HEAD, which froze every other process working in it.

`--autostash` fixes the first two: git stashes and restores around the rebase
itself, and restores on abort too. The rest is handling failure instead of
ignoring it — on a bad rebase, abort and leave the commit un-pushed rather than
walking away from a half-finished operation.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _git(*args: str, check: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(
        ['git', *args], cwd=ROOT, capture_output=True, text=True, check=check
    )


def commit_and_push(path: Path | str, message: str) -> bool:
    """Commit `path`, rebase onto origin, push. False if anything went wrong.

    Returns False rather than raising: a scraper that collected good data should
    not die because the network or a concurrent push got in the way. It must not
    report success either, which is why the caller gets a boolean.
    """
    _git('add', str(path))
    if _git('diff', '--cached', '--quiet').returncode == 0:
        print('[git_sync] no changes to commit')
        return True

    commit = _git('commit', '-m', message)
    if commit.returncode != 0:
        print(f'[git_sync] commit failed: {commit.stderr.strip()[:300]}')
        return False

    pull = _git('pull', '--rebase', '--autostash')
    if pull.returncode != 0:
        # Never leave the repo mid-rebase — other processes share this checkout.
        _git('rebase', '--abort')
        print(
            '[git_sync] pull --rebase failed, aborted and left the commit '
            f'un-pushed:\n{pull.stderr.strip()[:500]}'
        )
        return False

    push = _git('push')
    if push.returncode != 0:
        print(f'[git_sync] push failed: {push.stderr.strip()[:300]}')
        return False

    print('[git_sync] pushed')
    return True
