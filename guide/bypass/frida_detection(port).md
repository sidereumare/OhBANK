# 안티 디버깅 우회
---
# 안티 디버깅이란?

## 디버깅을 방지하여 소스코드 분석을 하지 못하도록 하는 기술이다

---

# 상세 가이드

메서드 후킹 감지를 찾는 코드 조각을 찾으려면 frida의 흔적에 대한 코드를 살펴보십시오.

디컴파일하여 구한 소스코드에서 "libfrida-check.so"파일을 확인한다
![so 파일](https://user-images.githubusercontent.com/53963779/200975846-a569e0d0-dfce-42a3-a175-34b8ed9757ad.png)

![ghidra 화면](https://user-images.githubusercontent.com/53963779/200976776-42ec84c2-6797-4df3-a39a-f5a5175eb5e1.png)

![adb 포트 포워딩](https://user-images.githubusercontent.com/53963779/200977079-35271620-98b1-4e59-bdc1-3e11d5ea4b04.png)

![frida-server 포트 포워딩](https://user-images.githubusercontent.com/53963779/200977207-576d4b1c-f986-44c8-926b-210630ec9691.png)

![포트포워딩 프리다 코드](https://user-images.githubusercontent.com/53963779/200977351-6a8e607b-3de8-4fcf-9944-fbf3d30b8355.png)

![앱 실행 성공](https://user-images.githubusercontent.com/53963779/200977562-960b1f1e-f41f-4d43-8bdd-f050193041ee.png)


grep -r -i frida
프리다 라이브러리 찾기

위의 이미지를 보면 lib/폴더와 System.loadLibrary((String)"frida-check"). 이것은 애플리케이션이 메소드 후킹/프리다 검사를 수행하기 위해 네이티브 코드로 작성된 메소드를 호출하고 있음을 의미합니다. lib/폴더를 열어 어떤 내용이 있는지 살펴보겠습니다 . genymotion을 사용하고 x86아키텍처에서 실행되므로 해당 디렉토리를 확인합시다. 일부 *.so파일을 볼 수 있으며 실행 파일입니다.

x86 제니모션

우리의 목표는 이러한 라이브러리 파일을 분석하는 것입니다. 이러한 라이브러리 파일을 분석하려면 IDA/ghidra와 같은 도구가 필요합니다. 무료로 여러 아키텍처를 지원하기 때문에 ghidra를 사용합시다.

기드라를 사용한 이진 분석
파일을 ghidra에 끌어다 libfrida-check.so놓고 모든 기본 옵션을 선택한 다음 로드되면 파일 이름을 두 번 클릭하여 ghidra를 엽니다.

기드라 드래그 앤 드롭

이것은 이진 분석에 대한 전체 확장 과정이 아니므로 기본 사항을 건너뛰고 분석을 시작하려고 합니다.

기드라 분석

fridaCheck오른쪽 에서 함수의 의사 코드를 볼 수 있습니다 . 20행에서 소켓 연결을 볼 수 있습니다. 응용 프로그램이 특정 포트에 연결을 시도하고 있으며 상태에 따라 일부 값을 반환합니다. 소켓 연결을 수행하려면 hostand port값이 필요하며 20행에서 데이터를 활용하는 것을 볼 수 local_28있습니다 0xa2690002.

대부분의 경우 바이너리에는 빅엔디안 형식의 코드가 포함되어 있습니다. 따라서 0xa2690002실제 값으로 변환해야 합니다. 이것은 8비트이므로 반으로 나누어야 합니다. 이제 0xa269및 가 0x0002됩니다. 빅엔디안에서 십진수 값으로 변환하려면 처음 2비트와 마지막 2비트를 바꿔야 합니다.

0xa2690x69a2십진법 등가가 입니다 27042.

이 값은 connect소켓 연결을 만드는 함수에 전달됩니다. 따라서 애플리케이션이 연결을 시도하는 포트 번호여야 합니다. 우리가 알고 있듯이 frida는 클라이언트 서버 아키텍처에서 실행됩니다. Frida의 기본 포트는 27042.

간단히 말해서 응용 프로그램은 27042frida가 실행 중인지 여부를 확인하기 위해 포트에 소켓 연결을 시도합니다. frida가 실행 중이면 27042점유됩니다. 애플리케이션이 포트에 소켓 연결을 할 수 있는지 여부에 따라 27042frida가 실행 중인지 여부를 결정합니다.

frida 감지 검사 우회
이상적으로는 응용 프로그램이 frida의 기본 포트만 찾고 있습니다. 이것을 우회하는 것은 간단합니다. 다른 포트에서 frida를 실행하기만 하면 됩니다.

에뮬레이터에서 frida 서버를 종료하고 1337.


emulator$ ./frida-server-14.2.18-android-x86 -l 0.0.0.0:1337

ubuntu$ frida -H $DEVICE_IP:1337 -f com.app.damnvulnerablebank -l scripts/script.js 
프리다 바이패스

위의 이미지에서 볼 수 있듯이 응용 프로그램을 frida와 연결하더라도 여전히 frida is not running. 우리는 frida 탐지와 루트 탐지 검사를 모두 우회했습니다.