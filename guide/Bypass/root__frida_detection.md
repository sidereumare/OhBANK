# 루팅 우회

## 1. 루팅이란 ?

루팅은 쉽게 말해 시스템 최고 권한(root)을 얻는 것이다. 안드로이드에서는 안정적인 기기의 동작을 보장하기 위해 루트 권한은 일반적인 사용자가 접근하지 못하도록 되어 있다. 시스템 내부 저장소 접근, 권한 변경 등 많은 작업을 수행할 수 있기 때문이다. 하지만 Frida를 이용한 후킹을 위해서는 루팅된 시스템이 필요하며, 이때 루팅 탐지 기법이 적용된 애플리케이션은 동작이 어려울 수 있다.


## 2. 공격 방법

![루팅하고 앱 실행](https://user-images.githubusercontent.com/53963779/200763026-84f11295-bcab-43c1-a408-72873e56eb49.png)

 루팅된 폰으로 앱 실행 시 루팅을 탐지하여 앱이 종료된다.

 jadx이용하여 apk 파일을 분석하면 

![jadx1](https://user-images.githubusercontent.com/53963779/200761967-567111da-6d5c-4f45-bc86-69cc4bf98254.png)

![jadx2](https://user-images.githubusercontent.com/53963779/200762046-1b0a707a-4553-4905-abf9-3b9a2ad503d1.png)


 루팅을 탐지하여 boolean형으로 값을 반환하는 함수를 확인할 수 있다. 후킹을 통해 false를 반환하도록 하면 루팅 탐지를 우회할 수 있다.

 추가로 fridaCheckJNI.java 파일을 확인해보면 frida를 탐지하는 코드를 확인할 수 있다.

 아래의 코드를 이용하여 루팅 탐지를 우회할 수 있다.
```python

##loader.py
import frida
import time

device = frida.get_usb_device(1)
pid = device.spawn(["com.app.damnvulnerablebank"])
device.resume(pid)
time.sleep(1) #Without it Java.perform silently fails
session = device.attach(pid)
script = session.create_script(open("frida.js").read())
script.load()

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


![jadx3](https://user-images.githubusercontent.com/53963779/201001702-42e5cd41-1791-4913-8e0c-cf3ac9c198dd.png)

 
 위의 코드를 이용하여 루팅 탐지 및 frida 탐지를 우회하면 앱이 정상적으로 실행이 된다.

![앱 실행 화면](https://user-images.githubusercontent.com/53963779/200764618-c8289263-1797-4e7b-896c-ef008df06fc2.png)

