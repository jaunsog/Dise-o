package com.example.tiorico;

import android.os.AsyncTask;
import android.widget.EditText;

import java.io.DataOutputStream;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.Socket;

public class EnviaUDP extends AsyncTask<String,Void,Void> {
    Socket s;
    DataOutputStream dt;
    PrintWriter pw;

    @Override
    protected Void doInBackground(String... voids) {

        String mensaje = voids[0];
        //String por=voids[1];
        //int server_port = Integer.parseInt(por);
        //String local1 = voids[2];
        try{
            String messageStr = mensaje;
            int server_port = 8000;
            InetAddress local = InetAddress.getByName("192.168.1.9");
            int msg_length = messageStr.length();
            byte[] message = messageStr.getBytes();


            DatagramSocket s = new DatagramSocket();
            //

            DatagramPacket p = new DatagramPacket(message, msg_length, local, server_port);
            s.send(p);
            }catch(Exception ex){
            }
        return null;
    }


}