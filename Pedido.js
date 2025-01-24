import React, { use, useState } from 'react' 
import {Text, View, StyleSheet, Pressable, Modal, ScrollView} from 'react-native' 
import GlobalStyles from './GlobalStyles';
import DetallesPedido from './DetallesPedido';
import { PrintNewOrder } from './Impresora';

 
 
 
const Pedido = ({datos, onUpdateList, setUpdate}) =>  {

    const [modalDetalles, setModalDetalles] = useState(false)
    const {idPedido, nombre, nota, total} = datos

    
    
    const handleUpdate = () =>{
        if(onUpdateList){
            onUpdateList()
        }
    }



    const EnviandoPedido = async () => {

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${idPedido}&estado=Delivery`, {
            method: 'PUT', //
            data:{
                estado: "Delivery"
            }
        })
            .then(response => response.json())
            .then(data => {
               //aqui llamamos a imprimir
               handleUpdate()
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    };
    
    
    


    return (
        <>
        <ScrollView>
            <View style={GlobalStyles.container}>
                <View style= {styles.organizador}>

                    <Pressable style= {styles.contenedor}
                    onPress={()=> {
                        console.log('ver detalles')
                        setModalDetalles(true)
                    }}> 
                        <Text style= {styles.label}>Pedido #{idPedido}</Text>
                        <Text style= {styles.label}>{nombre}</Text>
                        <Text style= {styles.label}>{nota}</Text>
                        <Text style= {styles.label}>{total} €</Text>  
                    </Pressable>

                    <View style={styles.btns}>
                        <Pressable style= {GlobalStyles.botonOk}
                        onPress={()=> {
                            console.log('pedido impreso')
                            PrintNewOrder(datos)
                        }
                        }>
                            <Text style= {GlobalStyles.txtOk}>Imprimir</Text>
                        </Pressable>
                        
                        <Pressable style= {GlobalStyles.btncancel}
                        onPress={()=> {
                            console.log('pedido enviado')
                            EnviandoPedido(idPedido)

                            
                            
                            
                            
                        }
                        }>
                            <Text style= {GlobalStyles.txtOk} >Enviado</Text>
                        </Pressable>
                    </View>    
                </View>
            </View>
            {modalDetalles &&(
                <Modal
                    visible= {modalDetalles}
                    animationType= 'slide'>
                    <DetallesPedido 
                    datos={datos}
                    setModalDetalles={setModalDetalles}
                    />
                </Modal>
            )}
            </ScrollView>
        </>
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


export default Pedido;