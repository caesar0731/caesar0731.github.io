---
title: "Claude Code 사용기 - 설정부터 실무 활용까지"
tags: [Claude, AI, 개발도구]
lastmod: 2026-04-19 08:00:00
sitemap:
    changefreq: daily
    priority: 0.5
comments: true
published: true
---

ChatGPT, Copilot, Gemini 등 새로운 AI가 등장할때마다 빠르게 사용해보며 개발자의 수명이 얼마나 남았는지 확인해보다가

(커서는 사용 안해봤습니다. 커서가 등장할때 코파일럿에 빠져서 한번에 하나만 파봤네요)

동료 개발자의 Opus 모델 찬양론에 힘입어 Claude Code로 정착하게 되었고

그동안 사용하면서 클로드에서 제공하는 자주 사용하는 기능이나

내 입맛대로 커스터마이징 해본것들을 공유해봅니다.

## 1. Claude Code란

Claude Code는 Anthropic에서 만든 터미널 기반 AI 코딩 도구입니다.

VS Code의 Copilot이나 Cursor 같은 IDE 확장과 달리 터미널에서 직접 실행됩니다.

이게 처음에는 단점이라고 생각해서 VS Code 익스탠션으로 어떻게든 끌어오려 했는데

사용하면 할수록 터미널에서 써야 가장 강력하고 효과적인지 몸소 깨닫게 되었습니다.

```sh
# 설치
npm install -g @anthropic-ai/claude-code

# 실행
claude
```

터미널에서 `claude`를 치면 대화형 세션이 시작되고

자연어로 지시하면 코드를 읽고, 수정하고, 커밋까지 해줍니다.

## 2. 디렉토리 구조

Claude Code의 설정 파일들은 크게 두 곳에 위치합니다.

```
* 글로벌 설정

~/.claude/
├── CLAUDE.md                 # 전역 지시사항
├── settings.json             # 전역 설정 (모델, 권한, 훅 등)
├── settings.local.json       # 로컬 전용 설정 (git에 안 올라감)
├── statusline.sh             # 상태바 커스텀 스크립트
├── hooks/                    # 훅 스크립트
├── skills/                   # 커스텀 스킬
└── ...

* 로컬 설정

프로젝트/
├── CLAUDE.md                 # 프로젝트별 지시사항
└── .claude/
    ├── settings.json         # 프로젝트별 설정
    ├── settings.local.json   # 프로젝트별 로컬 설정
    └── skills/               # 프로젝트 전용 스킬
```

개인용 맥북과 업무용 맥북 두대를 사용할때 

작업은 회사 업무와 개인 사이드 프로젝트로 변경이 되더라고

단축키, 작업환경, 개발편의 도구들은 동일하게 사용하길 원했습니다.

기존에 VS Code에서는 설정을 개인 계정에 공통으로 Sync를 맞춰놔서 해결했었고

이와 비슷하게 클로드도 자체적으로 지원하면 좋겠지만 아직은 없어서 

`~/.claude/` 하위 전역 설정들이나

같은 프로젝트를 여러곳에 세팅해둘때는 프로젝트 설정파일을

dotfiles 레포에서 버전관리하고 심볼릭 링크로 연결시켜두었습니다.

## 3. CLAUDE.md - 지시사항 설정

CLAUDE.md는 Claude Code에게 주는 지시사항 문서입니다.

전역 CLAUDE.md와 프로젝트별 CLAUDE.md가 있고, 세션 시작 시 자동으로 읽어들입니다.

### 전역 CLAUDE.md

```markdown
# Global Rules

## Tool Usage
- 파일 검색은 Glob 도구, 내용 검색은 Grep 도구를 우선 사용할 것
- Bash로 grep/find 사용은 파이프 조합이 필요한 경우에만 허용

위 가이드는 클로드에서 작업을 진행하는 도중 매번 권한을 요청하느라 중단되지 않도록

권한을 허용해둔 명령어 위주로 사용하게끔 명시해두었습니다.

## GitHub CLI 계정
- ~/Projects/회사프로젝트/ 하위 프로젝트: gh auth switch --user 회사 계정
- ~/Projects/개인프로젝트/ 하위 프로젝트: gh auth switch --user 개인 계정
```

회사와 개인 GitHub 계정을 분리해서 사용하다 보니

프로젝트 경로에 따라 어떤 계정으로 전환할지를 적어뒀습니다.

이걸 안 적어두면 개인 레포에 회사 계정으로 PR을 만드는 사고가 생기기도 합니다.

### 프로젝트별 CLAUDE.md

프로젝트별 CLAUDE.md에는 해당 프로젝트의 기술 스택, 코드 컨벤션, 자주 쓰는 커맨드 등을 적습니다.

실무 프로젝트 예시:

```markdown
## Do NOT
- Use `any` type → use `unknown` or specific types
- Use inline styles → use Tailwind CSS
- Call `fetch` directly → use React Query hooks
- Use default Tailwind colors → use design system colors

## Git Convention
### Commit Message
<type>: <JIRA-ID> <description in Korean>

### Branch Naming
- feature: feature/JIRA-123-description
- bugfix: fix/JIRA-123-description
```

"하지 말아야 할 것"을 명시적으로 적어두는 게 효과가 좋았습니다.

프로젝트에서 반복적으로 틀리는 패턴이 있으면 Do NOT 섹션에 추가하면 됩니다.

## 4. settings.json - 핵심 설정

### 글로벌 설정

```json
{
  "model": "claude-opus-4-6",
  "effortLevel": "medium",
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "Bash(ls *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(node *)",
      "Bash(npx *)"
    ]
  },
  "skipDangerousModePermissionPrompt": true,
  "skipAutoPermissionPrompt": true
}
```

위 Tool Usage에서 명시한 내용으로도 작업 진행중 권한을 요청하는 경우가 너무 많아

`skipDangerousModePermissionPrompt`으로 권한 확인을 건너뛰도록 했습니다.

아무래도 이쪽이 생산성이 훨씬 높은 느낌입니다.

다만 위험할수도 있기에 항상 Plan Mode로 작업 내용 전체를 확인하고 실행하는 습관을 가지고 있습니다.

`effortLevel`은 `medium`으로 설정해두면 속도와 품질 사이에서 균형을 잡아줍니다.

간단한 작업은 빠르게, 복잡한 작업은 좀 더 깊이 분석하는 식입니다.

### 로컬 설정

프로젝트 `.claude/settings.json`에는 해당 프로젝트에서만 쓰는 명령어를 추가합니다.

`settings.local.json`에는 MCP 도구 권한이나 파이프 조합 같은 로컬 전용 설정을 넣습니다.

이 파일은 `.gitignore`에 포함되어 있어서 팀원과 공유되지 않습니다.

## 5. Hooks - 자동화 트리거

Hooks는 특정 이벤트가 발생했을 때 쉘 스크립트를 자동 실행하는 기능입니다.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/refresh-statusline-cache.sh all"
          }
        ]
      }
    ],
  }
}
```

아래에서 소개할 Statusline에서 사용하는 상태 갱신 로직을 훅으로 만들어두었습니다.

매번 세션이 시작될 때 상태들을 읽어와서 캐싱하는 로직입니다.

## 6. Status Line - 커스텀 상태바

Claude Code 하단에 표시되는 상태바를 커스터마이징할 수 있습니다.

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline.sh"
  }
}
```

제 상태바에는 다음 정보가 표시됩니다:

- **저장소명** (GitHub 링크 포함) + 현재 브랜치
- **모델명** (claude-opus-4-6)
- **구독 플랜**
- **컨텍스트 윈도우 사용량** (색상으로 구분 - 초록/노랑/빨강)
- **5시간/7일 Rate Limit** (초기화까지 남은 시간 포함)
- **MCP 연결 상태** (연결됨/전체)
- **스킬 수, 훅 수**
- **현재 시간**

특히 컨텍스트 윈도우나 MCP 상태가 가장 유용한데

한 피쳐가 끝나면 보통 clear 하거나 새로 열어서 컨텍스트를 관리하지만

작업이 길어질때는 의도적으로 compact 하거나 작업 내용을 임의로 분할해서 작업하곤 합니다.

또한 피그마, 노션, 지라 등 MCP등을 항상 연결해두지 않고

필요할때만 활성화해서 사용하여 컨텍스트 관리에도 도움이 되고 

피그마에 접근이 불가능하다는 메시지로 토큰을 낭비할일도 없습니다.

## 7. MCP (Model Context Protocol) 연동

MCP는 Claude Code에 외부 도구를 연결하는 프로토콜입니다.

저는 업무에서 세 가지를 주로 사용합니다:

### Figma MCP

```json
{
  "figma-remote-mcp": {
    "type": "http",
    "url": "https://mcp.figma.com/mcp"
  }
}
```

피그마 디자인을 Claude가 직접 읽을 수 있어서

"이 피그마 프레임을 React 컴포넌트로 만들어줘" 같은 작업이 가능합니다.

스크린샷을 찍어서 보여줄 수도 있고, Code Connect 맵핑 정보도 가져옵니다.

### Atlassian (JIRA) MCP

```json
{
  "atlassian": {
    "type": "stdio",
    "command": "uvx",
    "args": ["mcp-atlassian", "--jira-url", "https://xxx.atlassian.net"]
  }
}
```

JIRA 이슈를 Claude 세션 안에서 바로 조회할 수 있습니다.

"BOOKING-552 이슈 내용 확인해줘"라고 하면 이슈 제목, 설명, 첨부 이미지까지 가져와서

작업 컨텍스트를 빠르게 파악할 수 있습니다.

### Notion MCP

노션 문서도 MCP로 연결해서 정책 기획 문서를 참고하면서 코딩할 수 있습니다.

## 8. 커스텀 스킬

자주 반복하는 워크플로우를 스킬로 만들어둘수 있습니다.

기존에는 커맨드였던거같은데 스킬로 마이그레이션 된거같습니다.

```
.claude/
└── skills/
    ├── worktree       # 워크트리 작업 시작
    ├── wroktree-end   # 워크트리 작업 종료
```

## 9. 자주 쓰는 사용 패턴

### 이슈 기반 작업

```
JIRA-000 이슈 확인하고 구현해줘
```

JIRA MCP로 이슈를 확인하고, 피그마 MCP로 디자인을 참고해서 코드를 작성합니다.

### Plan 모드

복잡한 작업은 `shift+tab`을 두 번 눌러 Plan 모드로 진입합니다.

구현 계획을 먼저 세우고 승인하면 그때 실행하는 방식이라

대규모 리팩토링이나 새 기능 구현 시 방향이 틀어지는 걸 방지할 수 있습니다.

### Worktree 활용

```
/worktree
```

현재 작업과 별도로 격리된 환경에서 작업할 수 있습니다.

실험적인 변경을 해보고 싶을 때 현재 브랜치를 건드리지 않고 테스트할 수 있어서 유용합니다.


## 마무리

처음에는 코파일럿을 사용할때처럼 VS Code의 한 화면 안에서 개발하는게 익숙하다 보니

Claude Code를 어떻게든 VS Code의 한쪽 영역에 위치시키려 했는데

2개, 3개 작업을 동시에 하거나 git, gh, mcp 등 터미널에서 사용하는 명령어들을 사용하거나

플랜 완료후 결과가 자꾸 외부 창으로 이동하는 등의 불편함이 있어서

결국 터미널로 정착하게 되었습니다.

초반에는 터미널에서 한글 입력도 불편하고 내 사용량 확인도 어렵고 매번 탭을 열고 클로드를 키는것도 불편했는데

설정을 하나씩 쌓아가다 보니 꽤 강력한 개발 환경이 됐습니다.

코드 스타일을 유지하거나 다양한 mcp를 연결하는건 당연하고

반복적인 작업을 자동화하고 병렬로 여러가지 이슈들을 해결하는데 가장 큰 도움이 되는거같습니다.
