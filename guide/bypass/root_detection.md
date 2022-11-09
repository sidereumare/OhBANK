# 루팅 우회
---
# 루팅이란 ?

## 루팅은 쉽게 말해 시스템 최고 권한(root)을 얻는 것이다. 안드로이드에서는 안정적인 기기의 동작을 보장하기 위해 루트 권한은 일반적인 사용자가 접근하지 못하도록 되어 있다. 시스템 내부 저장소 접근, 권한 변경 등 많은 작업을 수행할 수 있기 때문이다. 하지만 Frida를 이용한 후킹을 위해서는 루팅된 시스템이 필요하며, 이 때 루팅 탐지 기법이 적용된 애플리케이션은 동작이 어려울 수 있다.

---
# 상세 가이드
---
![image](https://user-images.githubusercontent.com/53963779/200763026-84f11295-bcab-43c1-a408-72873e56eb49.png)

## 루팅된 폰으로 앱 실행 시 루팅을 탐지하여 앱이 종료된다.

## jadx이용하여 apk 파일을 분석하면 

![Untitled (6)](https://user-images.githubusercontent.com/53963779/200761967-567111da-6d5c-4f45-bc86-69cc4bf98254.png)

![Untitled (7)](https://user-images.githubusercontent.com/53963779/200762046-1b0a707a-4553-4905-abf9-3b9a2ad503d1.png)

    1. MainActivity에서 RootUtil.isDeviceRooted()를 호출하여 루팅 탐지후 finish()하는 것을 확인
    2. fridaCheck.fridaCheck()에서 프리다 우회 탐지 후 finish 하는 것도 확인 가능


#### 아래의 코드를 이용하여 루팅 탐지를 우회할 수 있다.
```python
#loader.py
import frida  #frida 우회를 위한 라이브러리 사용
import time

device = frida.get_usb_device(1) #현재 연결된 device 설정
pid = device.spawn(["com.app.damnvulnerablebank"]) #damnvulnerablebank를 우회하기 위해 지정
device.resume(pid)
time.sleep(1) #Without it Java.perform silently fails
session = device.attach(pid)
script = session.create_script(open("frida.js", encoding='UTF-8').read())
script.load()

# #prevent the python script from terminating
input()
```

```javascript

//frida.js
console.log("Script loaded successfully");
Java.perform(function() {
    console.log("Inside java perform function");
    // 루팅 우회
    var RootUtil = Java.use("com.app.damnvulnerablebank.RootUtil"); //RootUtil 파일 사용 선언
    RootUtil.isDeviceRooted.overload().implementation = function () {
        console.log("isDeviceRooted");
        return false;  //리턴값을 false로 하여 우회
    }
    // frida 우회
    var Frida = Java.use("com.app.damnvulnerablebank.FridaCheckJNI");//RootUtil 파일 사용 선언
    Frida.fridaCheck.overload().implementation = function () {
        console.log("Inside fridaCheck");
        return false;  //리턴값을 false로 하여 우회
    }
});

```

#### 위의 코드를 이용하여 루팅 탐지를 우회하면 앱이 정상적으로 실행이 된다.

![image](https://user-images.githubusercontent.com/53963779/200764618-c8289263-1797-4e7b-896c-ef008df06fc2.png)

