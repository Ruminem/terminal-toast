# Terminal Toast

**English** · [한국어](#korean)

A long build finishes while you are reading something in the browser, and you find out five
minutes later. This tells you as it happens: when a terminal command that took a while ends
and the VS Code window is in the background, a Windows toast says what ran, how long it
took, and whether it failed.

## What it can see

| Where the command ran | Announced |
|---|---|
| Integrated terminal, with shell integration on | yes |
| A task: Run Build Task, an npm script, any task provider | yes |
| An extension running a process into an Output channel | **no** |

Nothing has to be wrapped or prefixed: shell integration reports when a terminal command
starts and ends, and the task API does the same for tasks. If the terminal shows no command
decorations, shell integration is off for that shell and nothing will be reported — see
[Terminal Shell Integration](https://code.visualstudio.com/docs/terminal/shell-integration).

The third row is a real gap and no extension can close it. A build an extension runs by
itself, writing only to its Output channel, is invisible to the rest of VS Code. CMake Tools
does this by default; setting `cmake.buildTask` to `true` makes it build through a task,
which this extension does see.

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
code --install-extension terminal-toast-0.1.1.vsix
```

## License

Apache-2.0

---

## Korean

[English](#terminal-toast) · **한국어**

오래 걸리는 빌드가 끝난 걸 브라우저 보다가 5분 뒤에야 알게 됨. 이 확장은 끝나는 순간에
알려 줌 — 한참 걸린 터미널 명령이 끝났는데 VS Code 창이 백그라운드면, 무엇이 돌았고 얼마나
걸렸고 실패했는지를 윈도우 토스트로 띄움.

### 무엇을 볼 수 있나

| 명령이 돈 곳 | 알림 |
|---|---|
| 통합 터미널, 셸 통합 켜진 상태 | 뜸 |
| 태스크 — 빌드 태스크 실행, npm 스크립트, 확장이 제공하는 태스크 | 뜸 |
| 확장이 직접 프로세스를 돌려 출력 패널에만 찍는 경우 | **안 뜸** |

명령을 감싸거나 앞에 무언가를 붙일 필요는 없음. 셸 통합이 터미널 명령의 시작과 끝을 알려 주고,
태스크 API가 태스크에 대해 같은 일을 함. 터미널에 명령 표식이 안 보이면 그 셸에서 셸 통합이
꺼진 것이고, 그러면 아무것도 안 뜸 —
[Terminal Shell Integration](https://code.visualstudio.com/docs/terminal/shell-integration) 참고.

셋째 줄은 진짜 빈틈이고 어떤 확장도 못 메움. 확장이 스스로 돌려서 자기 출력 패널에만 찍는
빌드는 VS Code의 다른 부분에서 아예 안 보임. CMake Tools가 기본값이 그럼. `cmake.buildTask`를
`true`로 두면 태스크로 빌드하게 되고, 그러면 이 확장이 볼 수 있음.

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
code --install-extension terminal-toast-0.1.1.vsix
```

### 라이선스

Apache-2.0
