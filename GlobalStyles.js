import React from 'react' 
import {StyleSheet} from 'react-native' 
 
 

const GlobalStyles = StyleSheet.create({
    top:{
        backgroundColor: '#cf2323',
        padding: 25
    },
    container:{
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 10
      
    },
    botonOk:{
        backgroundColor: '#cf2323',
        padding: 10,
        borderRadius: 10,
        fontWeight: 'bold'

    },
    txtOk:{
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,

    },
    header:{
        textAlign: 'center',
        color : '#fff',
        fontSize: 20,
        textTransform: 'capitalize',
        fontWeight: 'bold',
        marginBottom: -10
    },
    btncancel: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        fontWeight: 'bold'
    }

 
 })


export default GlobalStyles;