---
title: "Figma Dev Mode MCP - VSCode Copilot"
tags: figma
lastmod: 2025-08-15 08:00:00
sitemap: 
    changefreq : daily
    priority : 0.5
comments: true
---

# Figma Dev Mode MCP - VSCode Copilot

피그마 데브모드 MCP를 VSCode Copilot에 연결해서 Agent 모드로 피그마 디자인을 생성합니다.

기본값은 jsx + tailwind 이며 명령어에따라 다양하게 생성할수 있습니다.


### Figma

1. 피그마 데브모드 MCP 활성화

- 피그마 (데스크탑 앱) > 기본설정 > DEV MODE MCP 서버 활성화

2. MCP 서버 주소 

- http://127.0.0.1:3845/mcp

### VSCODE

3. .vscode/setting.json mcp 서버 리스트 활성화 및 agent 모드 활성화

```json
{  
	"chat.mcp.discovery.enabled": true,
  "chat.agent.enabled": true
}
```

4. .vscode/mcp.json에 mcp 서버 설정

- figma에서 활성화한 mcp 주소

```
{
  "servers": {
    "Figma Dev Mode MCP": {
      "type": "sse",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

5. 코파일럿 agent 모드 도구 || 명령어 파레트 모드에서 > Figma Dev Mode MCP mcp 서버 실행

6. (선택사항) copilot-instructions에 프롬프트 가이드 추가

- 디자이너분들이 정의해준 컴포넌트 정보, 레이어 속성등이 자세할수록 코드가 더 상세하게 작성됩니다.
- 최대한 피그마 디자인과 프로젝트에서 사용하는 디자인 시스템을 활용하도록 경로를 설정하세요.

```markdown
- 디자인과 정확히 일치하도록 Figma의 완성도를 우선시하세요.
- 디자인 시스템의 공통 컴포넌트는 `src/components`하위의 컴포넌트를 활용하세요.
- 에셋 이미지 등은 피그마에서 다운받아 사용하세요.
```

7. 피그마에서 디자인 링크 복사

- 영역이 작을수록 오류 없이 디자인 그대로 생성합니다.

![image.png](attachment:88c8bd17-7861-40b5-8815-2183cd5fcc46:05b766c2-745e-4168-92e7-6e1918f6dda5.png)

8. 코파일럿 - agent에서 명령 (기본값: jsx - tailwind)

```
`https://www.figma.com/design/{내프로젝트디자인주소}` 이 피그마 디자인을 코드로 변환해줘
기존 프로젝트 구조를 확인해서 유사한 컴포넌트 구조로 작성해줘
```

