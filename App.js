import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
import { styles } from './styles';
import { DevSettings } from 'react-native';

const App = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [permiso, setPermiso] = useState(false)
  const [conectado, setConectado] = useState(false)


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
        console.log(rsp);
        
        
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
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);
  
  

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

  useEffect(()=>{

    const inicio = async ()=>{
      if (pairedDevices.length == 0){
        await scanBluetoothDevice()
        console.log('escaneando dispositivos');
        
      }
      else{
        //connect(pairedDevices[0])
        console.log('conectado a ',pairedDevices[0], 'linea 264');
        
      }
    
      
    }
    
    inicio()
  },[])

  const conectarImpresora = ()=>{
    setInterval(()=>{
      
      
       
    },10000)

    return ()=>clearInterval()
  }

  useEffect(()=>{

  },[])

  
  
  

  

 
    




  return (
      <ScrollView style={styles.container}>
        <View style={styles.bluetoothStatusContainer}>
          <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
            Bluetooth {bleOpend ? 'Activo' : 'Desactivado'}
          </Text>
        </View>
        {!bleOpend && <Text style={styles.bluetoothInfo}>Activa bluetooht</Text>}
        <Text style={styles.sectionTitle}>Impresora Activa</Text>
        {boundAddress.length > 0 && (
          <ItemList
            label={name}
            value={boundAddress}
            onPress={() => unPair(boundAddress)}
            actionText="Desconectar"
            color="#E9493F"
          />
        )}
        {boundAddress.length < 1 && (
          <Text style={styles.printerInfo}>todavia no hay impresora conectada</Text>
        )}
        {/* aqui se muestra la lista de impresoras encontradas */}
        <Text style={styles.sectionTitle}>Dispositivos Encontrados:</Text>
        {loading ? <ActivityIndicator animating={true} /> : null}
        <View style={styles.containerList}>
          {pairedDevices.map((item, index) => {
            return (
              <ItemList
                key={index}
                onPress={() => {
                  connect(item)
                  console.log(item);
                  
                }}
                label={item.name}
                value={item.address}
                connected={item.address === boundAddress}
                actionText="Conectar"
                color="#00BCD4"
              />
              
            );
          })}
          {/* aqui se muestra la lista de impresoras encontradas final */}
        </View>
        <SamplePrint />
        <Button
          onPress={() => scanBluetoothDevice()}
          title="Scan Bluetooth"
        />
        <View style={{height: 100}} />
      </ScrollView>
  );
};

export default App;
