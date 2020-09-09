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
    private Handler hndlr = new Handler();
    String sms;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        IP = (EditText) findViewById(R.id.IP);
        puerto = (EditText) findViewById(R.id.puerto);

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
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 100, location);
    }
    public void Stop (View view){
        hndlr.removeCallbacks(envio);
    }
    public void UDPbutton (View view){
        envio.run();
    }

    private class getlocation implements LocationListener {
        @RequiresApi(api = Build.VERSION_CODES.O)
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyMMddHHmmssZ");
            String timestamp = simpleDateFormat.format(calendar.getTime());
            sms=location.getLatitude()+","+location.getLongitude()+","+timestamp;
        }
    }
    private Runnable envio = new Runnable(){
        @Override
        public void run() {
            String msg=sms;
            UDP UDP1 = new UDP();
            UDP1.execute(msg);
            makeText(getApplicationContext(), "Enviado", Toast.LENGTH_LONG).show();
            hndlr.postDelayed(this, 6000);
        }
    };

    public class UDP extends AsyncTask<String,Void,Void> {
        @Override
        protected Void doInBackground(String... voids) {
            String mensaje = voids[0];
            try {
                int port = Integer.parseInt(puerto.getText().toString());
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
            return null;
        }
    }
}



