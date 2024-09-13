import React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [result, setResult] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [value, setValue] = useState("");
  const [currencyKeys, setCurrencyKeys] = useState([]);
  const [currencyValues, setCurrencyValues] = useState([]);


  var myHeaders = new Headers();
  myHeaders.append("apikey", "x5ocGu8wvryZRoLV3GkJ5zcaBK8uMy3X");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const convertCurrency = (cur) => {
    console.log(cur)
    const keyIndex = currencyKeys.findIndex(key => key === cur);
    if (keyIndex !== -1) {
      const selectedRate = currencyValues[keyIndex];
      const convertedValue = (value / selectedRate).toFixed(2);
      setResult(`${convertedValue} EUR`)
    } else {
      console.log("Valuuttakurssia ei löydy.")
    }

  }

  React.useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/latest", requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);

        return response.json()
      })
      .then(data => {
        setCurrencyKeys(Object.keys(data.rates));
        setCurrencyValues(Object.values(data.rates));
      })
      .catch(err => console.error(err));
  }, [])



  return (
    <View style={styles.container}>
      <Image
        style={{ width: 250, height: 300, backgroundColor: 'grey' }}
        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/002/590/641/non_2x/dollar-and-euro-coins-line-and-fill-style-free-vector.jpg' }} />

      <Picker
        style={styles.picker}
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCurrency(itemValue)
        }>
        {currencyKeys.map((currency, index) => (
          <Picker.Item key={index} label={currency} value={currency} />
        ))}
      </Picker>
      <Text>{result}</Text>
      <Button style={styles.button} title="Convert" onPress={() => convertCurrency(selectedCurrency)} />
      <TextInput
        style={{ fontSize: 20, margin: 3 }}
        keyboardType='numeric'
        placeholder='amount to convert...'
        value={value}
        onChangeText={(text) => setValue(text)} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    flex: 2,
    width: 150,  // Määritä leveys
    height: 50,  // Määritä korkeus
    marginVertical: 10,  // Jotta elementti saa tilaa ylös ja alas
  },
  button: {
    color: 'red',
    backgroundColor: 'blue',
  }

});
