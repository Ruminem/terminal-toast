# Terminal Toast

**English** · [한국어](#korean)

A long build finishes while you are reading something in the browser, and you find out five
minutes later. This tells you as it happens: when a terminal command that took a while ends
and the VS Code window is in the background, a Windows toast says what ran, how long it
took, and whether it failed.

## How it works

VS Code's shell integration reports when a command starts and ends, so nothing has to be
wrapped or prefixed. If the terminal shows no command decorations, shell integration is off
for that shell and nothing will be reported — see
[Terminal Shell Integration](https://code.visualstudio.com/docs/terminal/shell-integration).

The toast goes through PowerShell, so it is Windows only. Everywhere else the VS Code
notification still appears.

## Settings

| Setting | Default | What it does |
|---|---|---|
| `terminalToast.minSeconds` | `30` | Only commands that took at least this long are announced. |
| `terminalToast.unfocusedOnly` | `true` | Only notify while the VS Code window is in the background. |

**Terminal Toast: Send a Test Notification** sends a sample notification, to check the
toast works on your machine.

## Build

No dependencies to install.

```sh
npm test
npm run package   # produces terminal-toast-<version>.vsix
code --install-extension terminal-toast-0.0.1.vsix
```

## License

Apache-2.0

---

## Korean

[English](#terminal-toast) · **한국어**

오래 걸리는 빌드가 끝난 걸 브라우저 보다가 5분 뒤에야 알게 됨. 이 확장은 끝나는 순간에
알려 줌 — 한참 걸린 터미널 명령이 끝났는데 VS Code 창이 백그라운드면, 무엇이 돌았고 얼마나
걸렸고 실패했는지를 윈도우 토스트로 띄움.

### 동작 방식

VS Code 셸 통합이 명령의 시작과 끝을 알려 주므로, 명령을 감싸거나 앞에 무언가를 붙일 필요가
없음. 터미널에 명령 표식이 안 보이면 그 셸에서 셸 통합이 꺼진 것이고, 그러면 아무것도 안 뜸 —
[Terminal Shell Integration](https://code.visualstudio.com/docs/terminal/shell-integration) 참고.

토스트는 PowerShell을 거치므로 윈도우에서만 뜸. 다른 OS에서는 VS Code 알림만 뜸.

### 설정

| 설정 | 기본값 | 하는 일 |
|---|---|---|
| `terminalToast.minSeconds` | `30` | 이 초 수 이상 걸린 명령만 알림. |
| `terminalToast.unfocusedOnly` | `true` | VS Code 창이 백그라운드일 때만 알림. |

**Terminal Toast: 알림 보내 보기**를 실행하면 견본 알림을 한 번 띄움. 내 PC에서 토스트가
뜨는지 확인할 때 씀.

### 직접 빌드하기

설치할 의존성 없음.

```sh
npm test
npm run package   # terminal-toast-<version>.vsix 생성
code --install-extension terminal-toast-0.0.1.vsix
```

### 라이선스

Apache-2.0
