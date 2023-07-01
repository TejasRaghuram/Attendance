import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import * as Font from 'expo-font';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        fontsLoaded: false,
        signedIn: false,
        password: '',
        workshop: '',
        recorder: '',
        name: '',
        id: '',
        input: '',
        hasPermission: null,
        scanned: false,
    }
  }

  async loadFonts() {
    await Font.loadAsync({
      'Regular': require('./assets/fonts/Lexend-Regular.ttf'),
      'Bold': require('./assets/fonts/Lexend-Bold.ttf'),
    });
    this.setState({ fontsLoaded: true });
  }

  async askForCameraPermission() {
    this.setState({ hasPermission: await BarCodeScanner.requestPermissionsAsync() });
  }

  async findUser(id, pressed) {
    if(this.state.name === '' || pressed === true) {
      this.setState({ name: 'Processing...' });
      this.setState({ id: '' });
      try {
        let response = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets/19mpKTGCc7nX0RtG88BYSTXOqV9lWItDH1wrHwiHIBDI/values/Main?valueRenderOption=FORMATTED_VALUE&key=AIzaSyDw8koMXWUNZ-G-QTal-iialYFZPg-GWFk'
        );
        let responseJSON = await response.json();
        let found = false;
        for(const user of responseJSON.values) {
          if(user[0] === id) {
            this.setState({ name: user[1] });
            this.setState({ id: id });
            found = true;
          }
        }
        if(found === false) {
          this.setState({ name: '' });
        }
      } catch {}
    }
  }

  async giveCredit(credit) {

    if(this.state.id && this.state.name && this.state.workshop && this.state.recorder)
    {
      try {
        const url = "https://sheet.best/api/sheets/925cce2e-019a-4a89-bb5e-ebe29c982467/tabs/" + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        let response = await fetch (
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "ID": this.state.id,
              "NAME": this.state.name,
              "CREDIT": credit,
              "WORKSHOP": this.state.workshop,
              "RECORDER": this.state.recorder,
            }),
          }
        );
        this.setState({ name: '' });
        this.setState({ id: '' });
      } catch{}
    }
  }

  componentDidMount() {
    this.loadFonts();
    this.askForCameraPermission();
  }

  render () {
    if (this.state.fontsLoaded) {
      if(!this.state.signedIn)
      {
        return(
          <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Sign In</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder='Password'
              placeholderTextColor={'#AAAAAA'}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password} />
              <TouchableOpacity style={styles.submit} onPress={() => {
                if(this.state.password === 'password') {
                  this.setState({ signedIn: true });
                } else {
                  Alert.alert('Error', 'Password Incorrect');
                }
                this.setState({ password: '' });
                }}>
                <Text style={styles.button_text}>Submit</Text>
              </TouchableOpacity>
          </SafeAreaView>
        );
      } else {

      }
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>CS Club Attendance</Text>
          <TextInput
            style={styles.input} 
            placeholder='Workshop' 
            placeholderTextColor={'#AAAAAA'} 
            onChangeText={(workshop) => this.setState({workshop})}
            value={this.state.workshop} />
          <TextInput
            style={styles.input} 
            placeholder='Recorder'
            placeholderTextColor={'#AAAAAA'} 
            onChangeText={(recorder) => this.setState({recorder})}
            value={this.state.recorder} />
          <View style={styles.scanner_box}>
            <View style={styles.scanner}>
              <Text style={styles.error}>Camera Permission Needed</Text>
              <BarCodeScanner onBarCodeScanned={({ type, data }) => {this.findUser(data, false);}} style={styles.camera} />
            </View>
          </View>
          <View style={styles.or}>
            <View style={styles.or_bar} />
            <Text style={styles.or_text}>OR</Text>
          </View>
          <TextInput
            style={styles.id}
            placeholder='Enter ID Number'
            placeholderTextColor={'#AAAAAA'}
            onChangeText={(input) => this.setState({input})}
            value={this.state.input} />
          <TouchableOpacity style={styles.submit} onPress={() => {
            this.setState({ input: '' });
            this.findUser(this.state.input, true);
            }}>
            <Text style={styles.button_text}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.recognized}>
            <Text style={styles.recognized_header}>Student Recognized</Text>
            <Text style={styles.recognized_body}>{this.state.name}</Text>
            <Text style={styles.recognized_body}>{this.state.id}</Text>
          </View>
          <TouchableOpacity style={styles.full} onPress={() => {this.giveCredit(1);}}>
            <Text style={styles.button_text}>Full Credit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.half} onPress={() => {this.giveCredit(0.5);}}>
            <Text style={styles.button_text}>Half Credit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.no} onPress={() => {this.giveCredit(0);}}>
            <Text style={styles.button_text}>No Credit</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32323C',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontFamily: 'Bold',
    fontSize: 52,
    lineHeight: 52,
    marginLeft: 30,
    marginTop: 20,
  },
  input: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#5A5A64',
    borderRadius: 10,
    paddingLeft: 20,
    fontFamily: 'Regular',
    color: 'white',
    fontSize: 18,
  },
  scanner_box: {
    height: 100,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderColor: '#AAAAAA',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
  },
  scanner: {
    height: 90,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  error: {
    fontFamily: 'Regular',
    fontSize: 18,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
  },
  or: {
    marginTop: 10,
  },
  or_bar: {
    height: 2,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
  },
  or_text: {
    width: 40,
    textAlign: 'center',
    fontFamily: 'Regular',
    color: 'white',
    fontSize: 18,
    backgroundColor: '#32323C',
    position: 'absolute',
    left: '50%',
    transform: [{translateX: -20}],
  },
  id: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 18,
    backgroundColor: '#5A5A64',
    borderRadius: 10,
    paddingLeft: 20,
    fontFamily: 'Regular',
    color: 'white',
    fontSize: 18,
  },
  submit: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: '#69A1F5',
    justifyContent: 'center',
  },
  button_text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Bold',
    textAlign: 'center',
  },
  recognized: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#5A5A64',
  },
  recognized_header: {
    marginTop: 10,
    fontFamily: 'Regular',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  recognized_body: {
    fontFamily: 'Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
  },
  full: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: '#64BD8D',
    justifyContent: 'center',
  },
  half: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: '#EEE37D',
    justifyContent: 'center',
  },
  no: {
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: '#F56969',
    justifyContent: 'center',
  },
});
