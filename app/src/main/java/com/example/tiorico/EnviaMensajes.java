package com.example.tiorico;


import android.os.AsyncTask;
import android.widget.EditText;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;

public class EnviaMensajes extends AsyncTask<String,Void,Void> {

    Socket s;
    DataOutputStream dt;
    PrintWriter pw;
    @Override
    protected Void doInBackground(String... voids) {

        String mensaje = voids[0];
        //String ipe = voids[2];
        //String port1 = voids[1];
        //int port = Integer.parseInt(port1);
        try{
            s = new Socket("192.168.1.9",8000);
            DataOutputStream dout=new DataOutputStream(s.getOutputStream());
            dout.writeUTF(mensaje);
            dout.flush();
            dout.close();
            pw = new PrintWriter(s.getOutputStream());
            pw.write(mensaje);
            pw.flush();
            pw.close();
            s.close();
        }catch (IOException e)
        {
            e.printStackTrace();
        }

        return null;
    }
}
