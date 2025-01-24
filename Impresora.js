import React from 'react' 
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
 
 
export const PrintNewOrder = async (datos) => {
    const {idPedido, nombre, nota, total, createdAt, direccion_cliente, telefono_cliente}= datos


    const listaProductos= JSON.parse(datos.productos)
    console.log(listaProductos);

    let respuesta = ''
    const listaSeteada = listaProductos.map(producto => {
        
       respuesta += `${producto.cantidad}x ${producto.titulo}  ${producto.precio}Eur\n`

    }
    )

    console.log("lista seteada ", listaSeteada,);
    
    

      
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {}); //espacio en blanco
      //<-----------------titulo---------------->
      await BluetoothEscposPrinter.printText(`  Chako \n` ,{
                   encoding: 'UTF-8',
                   codepage: 10,
                   widthtimes: 2,
                   heigthtimes: 3,
                   fonttype: 0,
                  
                  
                 });
                
    //<-----------------fin titulo---------------->
    
    //<------------------Datos del cliente------------------>
    await BluetoothEscposPrinter.printerUnderLine(1);
     await BluetoothEscposPrinter.printText('\nDatos del cliente \n', {
         encoding: 'UTF-8',
                   codepage: 10,
                   widthtimes: 0,
                   heigthtimes: 1,
                   fonttype: 0,
     });
     await BluetoothEscposPrinter.printerUnderLine(0);
     await BluetoothEscposPrinter.printText(`Pedido #${idPedido}\nCliente: ${nombre}\nNota: ${nota}\nTelefono: ${telefono_cliente}\nDireccion: ${direccion_cliente} \n-------------------------------\n`, {
         encoding: 'UTF-8',
                   codepage: 10,
                   widthtimes: 0,
                   heigthtimes: 1,
                   fonttype: 0,
     });
//<------------------fin Datos del cliente------------------>

//<------------------productos------------------>
  await BluetoothEscposPrinter.printText(`${respuesta}\n-------------------------------\n`, {
           encoding: 'UTF-8',
                     codepage: 10,
                     widthtimes: 0,
                     heigthtimes: 1,
                     fonttype: 0,
       });



      //<------------------fin productos------------------>

       await BluetoothEscposPrinter.printText(`${total} Eur\nGracias por su compra\n${createdAt}`, {
         encoding: 'UTF-8',
                   codepage: 10,
                   widthtimes: 0,
                   heigthtimes: 1,
                   fonttype: 0,
     });
    //<---------------fin del ticket-------------------->
                 await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {}); //espacio en blanco
                 await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {}); //espacio en blanco
                 
                 
     }


     export const printReserva = async (datos) =>{
      const {email_cliente, id, nombre_cliente, personas, telefono_cliente,fecha_entrada} = datos
      await BluetoothEscposPrinter.printerUnderLine(1);
      await BluetoothEscposPrinter.printText('\nDatos del cliente \n', {
          encoding: 'UTF-8',
                    codepage: 10,
                    widthtimes: 0,
                    heigthtimes: 1,
                    fonttype: 0,
      });
      await BluetoothEscposPrinter.printerUnderLine(0);
      await BluetoothEscposPrinter.printText(`Reserva #${id}\nCliente: ${nombre_cliente}\nEmail: ${email_cliente}\nTelefono:${telefono_cliente}\nFecha: ${fecha_entrada}\nComensales: ${personas} \n-------------------------------\n`, {
          encoding: 'UTF-8',
                    codepage: 10,
                    widthtimes: 0,
                    heigthtimes: 1,
                    fonttype: 0,
      });
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {}); //espacio en blanco
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {}); //espacio en blanco
     }





