import React from 'react' 
import {Text, View, StyleSheet, Pressable} from 'react-native' 
import GlobalStyles from './GlobalStyles'
 
 
const Reservas = ({datos, reservas}) =>  {
    const {email_cliente, id, nombre_cliente, personas, telefono_cliente} = datos
    return (
        <View> 
<View style={GlobalStyles.container}>
                <View style= {styles.organizador}>

                    <Pressable style= {styles.contenedor}
                    onPress={()=> {
                        console.log('ver detalles')
                        setModalDetalles(true)
                    }}> 
                        <Text style= {styles.label}>Reserva #{id}</Text>
                        <Text style= {styles.label}>Nombre: {nombre_cliente}</Text>
                        <Text style= {styles.label}>Comensales: {personas}</Text>
                        <Text style= {styles.label}>Correo: {email_cliente}</Text>  
                        <Text style= {styles.label}>Telefono: {telefono_cliente}</Text>  
                        {/* //FIXME: falta fecha y hora */}
                    </Pressable>

                    <View style={styles.btns}>
                        <Pressable style= {GlobalStyles.botonOk}
                        onPress={()=> console.log('reserva aceptada')
                        }>
                            <Text style= {GlobalStyles.txtOk}>Aceptar</Text>
                        </Pressable>
                        
                        <Pressable style= {GlobalStyles.btncancel}
                        onPress={()=> console.log('reserva rechazada')
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