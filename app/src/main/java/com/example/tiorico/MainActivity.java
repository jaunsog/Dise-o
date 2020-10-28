package com.example.tiorico;
import android.Manifest;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import java.util.Calendar;
import android.os.Handler;
import java.io.IOException;
import java.net.InetAddress;
import android.widget.Toast;
import android.os.AsyncTask;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import android.widget.EditText;
import android.content.Context;
import android.app.AlarmManager;
import java.net.SocketException;
import android.location.Location;
import android.app.PendingIntent;
import java.text.SimpleDateFormat;
import android.annotation.SuppressLint;
import androidx.annotation.RequiresApi;
import android.location.LocationManager;
import androidx.core.app.ActivityCompat;
import android.content.pm.PackageManager;
import android.location.LocationListener;
import androidx.core.content.ContextCompat;
import static android.widget.Toast.makeText;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    EditText IP, puerto;
    String sms;
    int k = 0;
    int port=47625;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        IP = (EditText) findViewById(R.id.IP);
        puerto = (EditText) findViewById(R.id.puerto);

    };

    public void UDPbutton (View view){
        while (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_DENIED) {
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, 1000, getIntent(), PendingIntent.FLAG_CANCEL_CURRENT);
                AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
                alarmManager.set(AlarmManager.RTC, System.currentTimeMillis() + 2000, pendingIntent);
                System.exit(0);
            }
        }
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        LocationListener location = new getlocation();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 200, location);
    };

    private class getlocation implements LocationListener {
        @RequiresApi(api = Build.VERSION_CODES.O)
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {

            String port = puerto.getText().toString();
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmm");
            String timestamp = simpleDateFormat.format(calendar.getTime());
            sms=location.getLatitude()+","+location.getLongitude()+","+timestamp+","+port;
            UDP UDP1 = new UDP();
            UDP1.execute(sms);
            makeText(getApplicationContext(), "Enviado", Toast.LENGTH_LONG).show();
        }
    };

    public class UDP extends AsyncTask<String,Void,Void> {
        @Override
        protected Void doInBackground(String... voids) {
            String mensaje = voids[0];

            try {
                InetAddress local = InetAddress.getByName(IP.getText().toString());
                int msg_length = mensaje.length();
                byte[] mssg = mensaje.getBytes();
                DatagramSocket su = new DatagramSocket();
                DatagramPacket p = new DatagramPacket(mssg, msg_length, local, port);
                su.send(p);
            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                InetAddress local = InetAddress.getByName("18.233.129.12");
                int msg_length = mensaje.length();
                byte[] mssg = mensaje.getBytes();
                DatagramSocket su = new DatagramSocket();
                DatagramPacket p = new DatagramPacket(mssg, msg_length, local, port);
                su.send(p);
            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                InetAddress local = InetAddress.getByName("54.198.215.111");
                int msg_length = mensaje.length();
                byte[] mssg = mensaje.getBytes();
                DatagramSocket su = new DatagramSocket();
                DatagramPacket p = new DatagramPacket(mssg, msg_length, local, port);
                su.send(p);
            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                InetAddress local = InetAddress.getByName("54.159.110.67");
                int msg_length = mensaje.length();
                byte[] mssg = mensaje.getBytes();
                DatagramSocket su = new DatagramSocket();
                DatagramPacket p = new DatagramPacket(mssg, msg_length, local, port);
                su.send(p);
            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
    };
};



