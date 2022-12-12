# ready to use Websocket hook based on Socket.IO

## Description

Library use Async Storage to store strings and objects as persistante data.

## Basic example

```javascript
import {_storeData, _retrieveData, storeJsonbData, _retrieveJsonData} from "mkdm-rn-async-storage"
import {useEffect, useState} from "react"

export default function App(){

    const [storedToken, setStoredToken] = useState(null)

    const storeToken = async () => {
      try{
          const tokenRequest = await fetch('https://yourdomain.com/token')
          const serverResponse = await tokenRequest.json()
          // { token: "YOURIINCREDIBLYSECRETTOKEN}

          // Store as string
          const token = serverResponse.token
          await _storeData("MY_APP_STRING_TOKEN", token)

          // Store as JSON
          await _storeJsonData("MY_APP_OBJECT_TOKEN",serverResponse)
      }catch(error){
          console.log(error)
      }
    }

    useEffect(() => {
        storeToken()
    },[])


    return(
        <View>
          <Text>{storedToken}</Text>
          <Button title="Display String Token" onPress={async () => {
            const token = await _retrieveData("MY_APP_STRING_TOKEN")
            setStoredToken(token)
          }} >

          <Button title="Display String Token" onPress={async () => {
            const jsonData = await _retrieveJsonData("MY_APP_OBJECT_TOKEN")
            setStoredToken(jsonData.token)
          }} >
        </View>
    )
}
```

## Licence
