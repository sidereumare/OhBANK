# 클라우드 환경구축

![AWS 구성도 20221111 1345 (제출용)](https://user-images.githubusercontent.com/80191322/202901439-41f77f43-7566-4d21-a4be-adcd9b75f119.png)

클라우드를 사용시 자동으로 설정을 진행하는 CloudFormation을 이용합니다.

## 1.1 인증서 등록

![인증서 생성 명령어](https://user-images.githubusercontent.com/80191322/202901578-16553dfc-de04-4a6f-9608-f9a929eb8faa.png)

등록할 인증서를 생성하기 위해 위 코드를 실행하여 인증서를 생성합니다.

코드 실행 시 common name에 backend-vpn으로 설정 후 yes, yes입력 시 생성합니다.

![인증서 생성 결과](https://user-images.githubusercontent.com/80191322/202901602-e3b911be-d592-49bc-aadc-888fa0a67272.png)

완료 시 다섯가지 결과물이 생성된걸 확인할 수 있습니다.

![인증서 등록](https://user-images.githubusercontent.com/80191322/202901616-d0bbe345-4ca9-4d7e-b03f-3ea3dbdf2cce.png)

위 내용을 인증서 등록 화면의 aws certificate manager에서 인증서를 등록합니다.

인증서 본문에는 client1.domain.tld.crt, 프라이빗은 client1.domain.tld.key를 입력하고 인증서 체인은 ca.crt파일의 내용을 입력합니다.

동일하게 server.crt, server.key, ca.crt순서로 입력합니다.

![인증서 등록 완료](https://user-images.githubusercontent.com/80191322/202901651-222fab76-4e44-4d44-9eec-c20ebbb11a28.png)

완료 시 인증서 등록 완료 화면을 보면 인증서가 등록됨을 확인할 수 있습니다.

## 1.2. 키페어 등록

![키페어 생성](https://user-images.githubusercontent.com/80191322/202901946-86135a28-a4fb-466d-b0fd-bafcebd0700e.png)

다음 과정으로 ssh접속에 필요한 키 페어를 등록해야 합니다.

키는 ec2메뉴 아래의 키 페어 생성에서 적당한 이름을 작성하여 생성합니다.

## 1.3. CloudFormation 설정

![스택 생성 1단계](https://user-images.githubusercontent.com/80191322/202901967-df013c40-eec9-4dff-b616-afee9f1870ec.png)

화면에서 주어진 템플릿 파일 업로드 메뉴에서 CloudFormation.yaml파일을 업로드합니다.

![EC2 설정 입력](https://user-images.githubusercontent.com/80191322/202902066-6d5f6191-704d-4331-a0d4-ba7c593fe7ba.png)

화면에서 스택 이름과 1.2 키페어 등록 단계에서 생성한 EC2 키 페어를 지정합니다.

![DB설정 및 VPN 설정](https://user-images.githubusercontent.com/80191322/202902092-40d2e285-c4f2-4da1-b611-cbd6222451b6.png)

다음으로 DB username과 DB password를 입력합니다.

VPN을 세팅하기 위해 앞서 설정한 서버 인증서와 클라이언트 인증서의 ARN값을 입력합니다.

입력완료 시 자동으로 모든 자원을 생성 후 서버까지 동작됨을 확인 가능합니다.

![CloudFormation 결과 화면](https://user-images.githubusercontent.com/80191322/202902115-6870a823-f9df-4e8d-a251-45c087f919b1.png)

결과를 통해 webapi url과 서버 IP정보를 확인 가능합니다.