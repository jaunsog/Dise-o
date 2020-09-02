package com.example.tiorico;
import android.os.AsyncTask;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.Socket;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Looper;
import android.telephony.SmsManager;
import android.view.View;
import android.widget.EditText;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import static android.widget.Toast.*;
import static android.widget.Toast.makeText;

public class MainActivity<port> extends AppCompatActivity {
    EditText IP, puerto;

    private static final int REQUEST_CODE_LOCATION_PERMISSION = 1;
    int cambiar;
    int TMensaje  = 0;
    int port;
    String Longitude;
    String Latitude;
    String sms;
    String IPdestino;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        IP = (EditText) findViewById(R.id.IP);
        puerto = (EditText) findViewById(R.id.puerto);
        ActivityCompat.requestPermissions(this, new String[]{ Manifest.permission.ACCESS_COARSE_LOCATION}, PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.INTERNET}, PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, PackageManager.PERMISSION_GRANTED);
    }

    public void button(View view) {

        if (ContextCompat.checkSelfPermission(
                getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_CODE_LOCATION_PERMISSION
            );
        } else {
            getCurrentLocation();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
            if (requestCode == REQUEST_CODE_LOCATION_PERMISSION && grantResults.length > 0) {
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    getCurrentLocation();
                } else {
                    makeText(this, "Permiso denegado (gps)", LENGTH_SHORT).show();
                }
            }
        }

            private void getCurrentLocation() {
                final LocationRequest locationRequest = new LocationRequest();
                locationRequest.setInterval(10000);
                locationRequest.setFastestInterval(3000);
                locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);


                if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
        }
        LocationServices.getFusedLocationProviderClient(MainActivity.this)
                .requestLocationUpdates(locationRequest, new LocationCallback() {
                    @Override
                    public void onLocationResult(LocationResult locationResult) {
                        super.onLocationResult(locationResult);
                        LocationServices.getFusedLocationProviderClient(MainActivity.this)
                                .removeLocationUpdates(this);
                        if (locationResult != null && locationResult.getLocations().size() > 0) {
                            int latestLocationIndex = locationResult.getLocations().size() - 1;
                            double latitude = locationResult.getLocations().get(latestLocationIndex).getLatitude();
                            double longitude = locationResult.getLocations().get(latestLocationIndex).getLongitude();
                            Latitude = Double.toString(latitude);
                            Longitude = Double.toString(longitude);
                            Calendar calendar = Calendar.getInstance();
                            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MMM-yyyy-hh:mm:ss");
                            String dateTime = simpleDateFormat.format(calendar.getTime());
                            sms= "\n La=" + Latitude + "\n Lo= " +Longitude+"\n TS= "+dateTime;
                            if (!IP.getText().toString().equals("")&&!puerto.getText().toString().equals("")) {
                            EditText edit = findViewById(R.id.IP);
                            IPdestino = edit.getText().toString();
                            port = Integer.parseInt(puerto.getText().toString());
                            switch (TMensaje) {
                                case 0:
                                    TCP TCP = new TCP();
                                    TCP.execute(sms);
                                    break;
                                case 1:
                                    UDP UDP = new UDP();
                                    UDP.execute(sms);
                                    break;
                            }}
                        }
                    }
                }, Looper.getMainLooper());
    }

    public void TCPbutton(View view) {
        TMensaje = 0;
        button(view);
    }

    public void UDPbutton(View view) {
        TMensaje = 1;
        button(view);
    }

    public class UDP extends AsyncTask<String,Void,Void> {

        @Override
        protected Void doInBackground(String... voids) {
            String mensaje = voids[0];

            try{
                String messageStr = mensaje;
                int server_port = port;
                InetAddress local = InetAddress.getByName(IPdestino);
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

    public class TCP extends AsyncTask<String,Void,Void> {

        Socket s;
        PrintWriter pw;
        @Override
        protected Void doInBackground(String... voids) {

            String mensaje = voids[0];
            try{
                s = new Socket(IPdestino, port);
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
}




