import React from 'react' 
import {Text, View, StyleSheet, Pressable, Alert} from 'react-native' 
import GlobalStyles from './GlobalStyles'
import { printReserva } from './Impresora'
 
 
const Reservas = ({datos, reservas, AceptarReserva, RechazarReserva, StopSound}) =>  {
    const {email_cliente, id, nombre_cliente, personas, telefono_cliente,fecha_entrada} = datos
    

    const mostrarAlerta = () =>{
            Alert.alert(
                'Aviso!',
                'Seguro que deseas rechazar?',
                [
                    {text: 'Cancelar'},
                    {text: 'Si, Rechazar', onPress:()=> {
                        RechazarReserva(id)
    
                    } }
                ]
            )
        }

    return (
        <View> 
<View style={GlobalStyles.container}>
                <View style= {styles.organizador}>

                    <View style= {styles.contenedor}> 
                        <Text style= {styles.label}>Reserva #{id}</Text>
                        <Text style= {styles.label}>Nombre: {nombre_cliente}</Text>
                        <Text style= {styles.label}>Comensales: {personas}</Text>
                        <Text style= {styles.label}>Correo: {email_cliente}</Text>  
                        <Text style= {styles.label}>Telefono: {telefono_cliente}</Text>  
                        <Text style= {styles.label}>Fecha: {fecha_entrada}</Text>  
                        
                    </View>

                    <View style={styles.btns}>
                        <Pressable style= {GlobalStyles.botonOk}
                        onPress={()=> {console.log('reserva aceptada')
                            printReserva(datos)
                            AceptarReserva(id)
                            StopSound()

                        }
                        }>
                            <Text style= {GlobalStyles.txtOk}>Aceptar</Text>
                        </Pressable>
                        
                        <Pressable style= {GlobalStyles.btncancel}
                        onPress={()=> {console.log('reserva rechazada')
                            StopSound()
                            mostrarAlerta()
                        }
                        }>
                            <Text style= {GlobalStyles.txtOk} >Rechazar</Text>
                        </Pressable>
                    </View>    
                </View>
            </View>
        </View>
)} 


const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#d9d9d9',
        padding: 10,
        borderRadius: 10,
        width: '100%'
     },
     label:{
        color: '#000',
        fontSize: 16,
        marginVertical: 1,
        marginHorizontal: 2,
        textTransform: 'capitalize'
     },
     organizador:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        
     },
     btns: {
        justifyContent: 'space-evenly',
        transform: [{translateX: -100}]
     }
 
 })


export default Reservas;