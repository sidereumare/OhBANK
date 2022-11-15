# **MobSF란?**

MobSF(Mobile Security Framework)는 **정적 및 동적 분석**을 수행할 수 있는 **자동화**된 일체형 **모바일 애플리케이션**(Android/iOS/Windows) 침투 테스트, 악성 프로그램 분석 및 보안 평가 **프레임워크**이다



### **설치 방법**

- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) 다운로드
    - Python 3.8 / 3.9 버전에서만 빌드 가능 ( 3.10 에선 불가능)
    
- 추가 설치 필요한 항목
    - OpenSSL
    - Strawberry Perl (빌드에 Perl 사용)
        - 설치 과정 다소 복잡
        - Developer Command Prompt for VS ~ 을 실행해서 설치 진행했던 것으로 기억
    - wkhtmltopdf (PDF 보고서 다운받으려면 저장해야 함)

- Windows : MobSF 하위 경로에서 setup.bat 실행
    - 중간에 많은 오류들이 발생됨, 발생할 때마다 하나씩 해결하면서 설치해야 함



### **실행 방법**

1. 설치 완료 후 run.bat 실행

![Untitled](https://user-images.githubusercontent.com/53963779/201275674-8f4d76b7-ed90-4aaf-8062-bb1687b5d050.png)



2. [localhost:8000](http://localhost:8000) 접속

![Untitled 1](https://user-images.githubusercontent.com/53963779/201275391-6cc1744b-dc17-48b1-9b96-dd111bcc2e4c.png)


![Untitled 2](https://user-images.githubusercontent.com/53963779/201275572-d4c0f9ac-31c3-4a6b-9797-8bcb87bfbd6c.png)

3. 모바일 앱 파일 업로드하여 분석
- Upload & Analyze 클릭 → 분석할 모바일 앱 파일 선택하면 자동으로 분석 완료
    - PDF 결과 보고서가 필요할 경우 왼쪽 PDF Report 클릭

![Untitled 3](https://user-images.githubusercontent.com/53963779/201275757-f07caad5-bae6-4f5f-b6e4-626ce697c9cd.png)



### MobSF를 통한 OHBank 앱 정적 분석

MobSF를 이용하여 OhBank앱에 대한 상세한 정적 분석을 수행함

![image](https://user-images.githubusercontent.com/53963779/201276205-a8bd5431-5237-4fb1-9bc1-141a2f6fbc73.png)

CurrencyRates, SendMoney 액티비티에 딥링크가 존재함

![image](https://user-images.githubusercontent.com/53963779/201276596-9731d338-f9c5-4e5e-b78d-2789dc7bd9e0.png)

- Jadx-Gui를 통해 SendMoney 클래스를 확인
   - 액티비티의 딥링크는 account, money 파라미터를 받음
   - 딥링크가 실행되면 사용자의 계좌에서 account에 설정된 계좌번호로 money에 설정된 값만큼 자동으로 송금이 이루어지도록 설정되어 있음
