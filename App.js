import React, { useState, useEffect, useCallback, use } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
import { DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from './GlobalStyles';
import ListaPedidos from './ListaPedidos';
import Pedido from './Pedido';
import NuevoPedidoLista from './NuevoPedidoLista';
import Sound from 'react-native-sound';

const App = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [permiso, setPermiso] = useState(false)
  const [sucursal, setSucursal]= useState('')
  const [restaurante, setRestaurante]= useState(false)
  const [pedidos, setPedidos] = useState('')
  const [reservas, setReservas]= useState([])
  const [listaPedidos, setListaPedidos] = useState([])
  const [newOrderList, setNewOrderList] = useState([])
  const [modalNuevoPedido, setModalNuevoPedido] = useState(false)
  const [sound, setSound] = useState(null);
  const [notify, setNotify] = useState(false)

  // Cargar el sonido
  const loadSound = () => {
    const alertSound = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Error al cargar el sonido:', error);
        return;
      }
      alertSound.setNumberOfLoops(-1); // -1 para bucle infinito
      setSound(alertSound);
    });
  };

  useEffect(()=>{
    loadSound()
  },[])


  // Reproducir el sonido
  const playSound = () => {
    console.log('reproduciendo 62');
    
    if (sound) {
      setNotify(false)
      sound.play((success) => {
        if (!success) {
          console.error('Error al reproducir el sonido');
        }
      });
    } else {
      console.log('El sonido no está cargado');
    }
  };

  // Detener el sonido
  const StopSound = () => {
    if (sound) {
      sound.stop(() => {
        console.log('Sonido detenido');
      });
    }
  };
 
  useEffect(()=>{
  const loadSucursal = async ()=>{
    const value = await AsyncStorage.getItem('numerosucursal')
    console.log('sucursal guardad es', value);
    
    if(value > 0){
      setSucursal(value)
      setRestaurante(true)
    }
  }
  loadSucursal()
},[])
  
  

   useEffect(()=>{
     scanBluetoothDevice()
     console.log('escaneando dispositivos');
 },[])





  //<--------------------useefect------------------>
  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
        deviceFoundEvent(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
        setName('');
        setBoundAddress('');
      });
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
        const dispositivo = JSON.parse(rsp.devices)
        connect(dispositivo[0]);
        console.log('conectado a impresora linea 70');
        
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
        deviceFoundEvent(rsp);
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
        setName('');
        setBoundAddress('');
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
        ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
      });
    }
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan, permiso]);
  
  

  //<--------------------final del useefect------------------>

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);

      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );


  //<--------conecta impresora----------------->
  const connect = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };
//<--------fin conecta impresora----------------->
  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };
//<------------escaneamos dispositivos--------------->
  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  //<------------fin escaneamos dispositivos--------------->

  //<-----------solicitud de permisos--------------->

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message: 'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  //<-----------solicitud de permisos--------------->
  
  //<------------solicitamos premisos para escanear dispositivos------------->

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED) {
        scanDevices();
        setLoading(false);
        setPermiso(true)
        
        
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  //<------------fin solicitud permisos para escanear dispositivos------------->

  
  const sucursalValida = () => {
    if (sucursal > 0 && sucursal < 3){
      console.log("sucursal valida");
      setSucursal(sucursal)
      consultarApi()
      setRestaurante(true)

       
    }else{

      Alert.alert(
        'Error',
        'No existe sucursal'
      )
    }

  }

  useEffect(()=>{
    const saveSucursal= async () =>{
      if (restaurante){
        await AsyncStorage.setItem('numerosucursal', sucursal)
        
      }
      
    }

    
  saveSucursal() 
  },[restaurante])

  

  const consultarApiNuevoPedido = async () => {
    try {
      
        const respuesta = await fetch(`https://restaurant.ninjastudio.dev/api/pedidosBySucursal/${sucursal}`)
        const result = await respuesta.json()
        const response = await result.pedidos
        
        if(response){
          console.log(response.length, 'nuevos pedidos');
          
          
          setNewOrderList(response)
          if(response.length > 0){
            setNotify(true)
          }else{
            setNotify(false)
          }
          
          
      }

    } catch (error) {
      console.log(error);
      
    }
  }

  const consultarReservas = async () =>{
    const url= `https://restaurant.ninjastudio.dev/api/reservasBySucursal/${sucursal}`
    const solicitud= await fetch(url)
    const response =  await solicitud.json()

    if(response){
      setReservas(response.reservas)
      console.log(response.reservas.length , 'reservas');
      if(response.reservas.length > 0){
        setNotify(true)
      }else{
        setNotify(false)
      }
      
      
      
    }
  }
  useEffect(()=>{
    if(notify){
      playSound()
    }
  },[notify])
  
  
  
   useEffect(()=>{
     const interval = setInterval(() => {
      if(restaurante){

        consultarApiNuevoPedido()
        consultarReservas()
        consultarApi()
        
      }
        
    }, 20000);
    return () => clearInterval(interval);
  },[restaurante])

  
  
  
  const consultarApi = async () => {

    try {

      const pedidosApi = `https://restaurant.ninjastudio.dev/api/pedidosByPreparando/${sucursal}`
      const response = await fetch(pedidosApi)

      if(response){
        const result = await response.json()
        const filtrarpedidos = (result.pedidos)
        
        setListaPedidos(filtrarpedidos)
        

      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleUpdate = ()=>{
        consultarApi()
        consultarApiNuevoPedido()
        consultarReservas()
  }




  return (
    <>
    
      
    <ScrollView>
      <View style={GlobalStyles.top}></View>
      
        <View style={GlobalStyles.container}>
        <Text style={styles.label}>
          Selecciona Sucursal
        </Text>
        <TextInput 
        style={styles.input}
        placeholder= 'Sucursal'
        keyboardType= 'numeric'
        onChangeText= {setSucursal}/>
        <Pressable 
        style={[GlobalStyles.botonOk, styles.btnsize]}
        onPress= {()=> sucursalValida()}>
          <Text style={GlobalStyles.txtOk}>Ver Pedidos</Text>
        </Pressable>
        
        </View>
        
        <View>
          {restaurante && (
            <Modal
              visible= {restaurante}
              animationType= 'slide'>

              <ListaPedidos 
              listaPedidos= {listaPedidos}
              reservas= {reservas}
              setListaPedidos={setListaPedidos}
              setReservas={setReservas}
              onUpdateList={handleUpdate}
              newOrderList={newOrderList}
              setModalNuevoPedido= {setModalNuevoPedido}
              modalNuevoPedido={modalNuevoPedido}
              StopSound={StopSound}
              
              
              />
            </Modal>
          )}

        </View>
      </ScrollView>
      </>
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    marginVertical: 20,
    marginBottom: 30,
    textAlign: 'center'
  },
  label:{
    textAlign: 'center',
    fontSize: 24,
    fontWeight : 'bold',
    color: '#000'
  },
  btnsize:{
    marginHorizontal: '30%'
    
  }
 
})

export default App;
