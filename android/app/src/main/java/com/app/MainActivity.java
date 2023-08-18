package com.meda.gebi;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle; // required for onCreate parameter
import org.devio.rn.splashscreen.SplashScreen;
import android.content.*;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
//import net.nyx.printerclient.aop.SingleClick;
import net.nyx.printerservice.print.IPrinterService;
import net.nyx.printerservice.print.PrintTextFormat;
import timber.log.Timber;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

//import static com.app.Result.msg;




public class MainActivity extends ReactActivity {

    private ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
    private Handler handler = new Handler();
    String[] version = new String[1];

// SplashScreen
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this); 
      super.onCreate(savedInstanceState);
      bindService();
      Timber.plant(new Timber.DebugTree());

  }

    private IPrinterService printerService;
    private ServiceConnection connService = new ServiceConnection() {
        @Override
        public void onServiceDisconnected(ComponentName name) {
//            showLog("printer service disconnected, try reconnect");
            printerService = null;
            // 尝试重新bind
            handler.postDelayed(() -> bindService(), 5000);
        }

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Timber.d("onServiceConnected: %s", name);
            printerService = IPrinterService.Stub.asInterface(service);
//            getVersion();
        }
    };


    private void bindService() {
        Intent intent = new Intent();
        intent.setPackage("net.nyx.printerservice");
        intent.setAction("net.nyx.printerservice.IPrinterService");
        bindService(intent, connService, Context.BIND_AUTO_CREATE);
    }

    private void unbindService() {
        unbindService(connService);
    }

    public void paperOut() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    printerService.paperOut(80);
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void printBarcode() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int ret = printerService.printBarcode("123456789", 300, 160, 1, 1);
//                    showLog("Print text: " + msg(ret));
                    if (ret == 0) {
                        paperOut();
                    }
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void printQrCode() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int ret = printerService.printQrCode("Printer Test", 300, 300, 1);
//                    showLog("Print barcode: " + msg(ret));
                    if (ret == 0) {
                        paperOut();
                    }
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        });
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "app";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
