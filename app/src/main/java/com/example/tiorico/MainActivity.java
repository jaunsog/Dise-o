package com.example.tiorico;

import android.os.AsyncTask;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
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

public class MainActivity extends AppCompatActivity {
    EditText numero,IP, puerto;

    private static final int REQUEST_CODE_LOCATION_PERMISSION = 1;
    int cambiar;
    int TMensaje  = 0;
    String Longitude;
    String Latitude;
    String sms;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        IP = (EditText) findViewById(R.id.IP);
        puerto = (EditText) findViewById(R.id.puerto);
        numero = (EditText) findViewById(R.id.numero);
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.SEND_SMS}, PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(this, new String[]{ Manifest.permission.ACCESS_COARSE_LOCATION}, PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.INTERNET}, PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, PackageManager.PERMISSION_GRANTED);
    }

    public void button(View view) {
        cambiar = 0;

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


    public void MyMessage(String latitude, String longitude) {
        cambiar = 1;
        int permissionCheck = ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS);
        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
            if (!numero.getText().toString().equals("")) {
                Calendar calendar = Calendar.getInstance();
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MMM-yyyy-hh:mm:ss");
                String dateTime = simpleDateFormat.format(calendar.getTime());
                sms= "Latitud= " + Latitude + "\n Longitud= " +Longitude+"\n TimeStamp= "+dateTime;

                String phoneNumber = numero.getText().toString().trim();
                SmsManager smsManager = SmsManager.getDefault();
                smsManager.sendTextMessage(phoneNumber, null, sms, null, null);
                makeText(this, "Mensaje enviado", LENGTH_SHORT).show();
            } else {
                makeText(this, "Inserte número", LENGTH_SHORT).show();
            }
        } else {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.SEND_SMS}, 0);
        }



    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (cambiar == 1) {
            switch (requestCode) {
                case 0:
                    if (grantResults.length >= 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                        MyMessage(Latitude, Longitude);
                    } else {
                        makeText(this, "Permiso denegado (sms)", LENGTH_SHORT).show();
                    }
                    break;
            }
        } else {
            if (requestCode == REQUEST_CODE_LOCATION_PERMISSION && grantResults.length > 0) {
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    getCurrentLocation();
                } else {
                    makeText(this, "Permiso denegado (gps)", LENGTH_SHORT).show();
                }
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
                            sms= "Latitud= " + Latitude + ". Longitud= " +Longitude+".";
                            switch (TMensaje) {
                                case 0:
                                    MyMessage(Latitude
                                            , Longitude);
                                    break;
                                case 1:
                                    TCPMessage();
                                    break;
                                case 2:
                                    UDPMessage();
                                    break;
                            }
                        }
                    }
                }, Looper.getMainLooper());
                }


    public void TCPbutton(View view) {
        TMensaje = 1;
        button(view);
    }

    public void UDPbutton(View view) {
        TMensaje = 2;
        button(view);
    }
    public void TCPMessage(){
        EnviaMensajes EnviaMensajes = new EnviaMensajes();
        EnviaMensajes.execute(sms);
        TMensaje=0;}
    public void UDPMessage (){
        EnviaUDP EnviaUDP = new EnviaUDP();
        EnviaUDP.execute(sms);
    TMensaje=0;}
}




