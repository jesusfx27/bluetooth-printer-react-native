import React, { useState } from 'react' 
import {Text, View, StyleSheet, ScrollView, Modal} from 'react-native' 
import GlobalStyles from './GlobalStyles'
import Pedido from './Pedido'
import Reservas from './Reservas'
import NuevoPedidoDetalles from './NuevoPedidoDetalles'
import PedidoNuevo from './PedidoNuevo'
 
 //<-----------------------pagina principal------------------------>



const ListaPedidos = ({newOrderList, setModalNuevoPedido ,reservas, AceptarPedido, RechazarPedido, setIdReserva,AceptarReserva, RechazarReserva}) =>  {
    
  const [modalNewOrder, setModalNewOrder] = useState(false)



    return (
        <>
        
            <View style={GlobalStyles.top}>
                <Text style={GlobalStyles.header}>home</Text>
            </View>
            <ScrollView>
            <View>
                {newOrderList.length > 0 && (<Text style={styles.label}>Nuevo Pedido</Text>)}
                
                
            </View> 
            <View> 
                {newOrderList.length > 0 &&(newOrderList.map(datos => (
                            <PedidoNuevo
                            key={datos.idPedido}
                            datos= {datos}
                            AceptarPedido={AceptarPedido}
                            RechazarPedido={RechazarPedido}
                            />)
                          ))}
            </View>
            <View>
                
                {reservas.length > 0 && (<Text style={styles.label}>reservas</Text>)}
                
            </View>
            <View> 
                {reservas.length > 0 &&(reservas.map(datos => (
                            <Reservas 
                            key={datos.id}
                            datos= {datos}
                            reservas={reservas}
                            setIdReserva={setIdReserva}
                            AceptarReserva={AceptarReserva}
                            RechazarReserva={RechazarReserva}/>)
                          ))}
            </View>

            <View>
                {modalNewOrder && (
                    <Modal
                    visible= {modalNewOrder}
                    animationType= 'slide'>
                        <NuevoPedidoDetalles
                        setModalNewOrder={setModalNewOrder}
                        newOrderList= {newOrderList}/>
                    </Modal>
                )}
            </View>

            </ScrollView>
        </>
)} 


const styles = StyleSheet.create({
 label: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    marginTop: 30,
    textTransform: 'capitalize',
    marginBottom: 20
 }
 
 })


export default ListaPedidos;