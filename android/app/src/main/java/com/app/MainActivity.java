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
    private static final int RC_SCAN = 0x99;
    public static String PRN_TEXT;



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


    public final BroadcastReceiver qscReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            if ("com.android.NYX_QSC_DATA".equals(intent.getAction())) {
                String qsc = intent.getStringExtra("qsc");
//                showLog("qsc scan result: %s", qsc);
                printText("qsc-quick-scan-code\n" + qsc);
            }
        }
    };

    public void registerQscScanReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.android.NYX_QSC_DATA");
        registerReceiver(qscReceiver, filter);
    }

    public void unregisterQscReceiver() {
        unregisterReceiver(qscReceiver);
    }

    public void getVersion() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int ret = printerService.getPrinterVersion(version);
//                    showLog("Version: " + msg(ret) + "  " + version[0]);
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        });
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

    public void printText() {
        printText(PRN_TEXT);
    }
    public void printText(String text) {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    PrintTextFormat textFormat = new PrintTextFormat();
                    // textFormat.setTextSize(32);
                    // textFormat.setUnderline(true);
                    int ret = printerService.printText(text, textFormat);
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

    public void printBitmap() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int ret = printerService.printBitmap(BitmapFactory.decodeStream(getAssets().open("bmp.png")), 1, 1);
//                    showLog("Print bitmap: " + msg(ret));
                    if (ret == 0) {
                        paperOut();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void printLabel() {
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    int ret = printerService.labelLocate(240, 0);
                    if (ret == 0) {
                        PrintTextFormat format = new PrintTextFormat();
                        printerService.printText("\nModel:\t\tNB55", format);
                        printerService.printBarcode("1234567890987654321", 320, 90, 2, 0);
                        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
                        printerService.printText("Time:\t\t" + date, format);
                        ret = printerService.labelPrintEnd();
                    }
//                    showLog("Print label: " + msg(ret));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void printLabelLearning() {
        if (version[0] != null && Float.parseFloat(version[0]) < 1.10) {
//            showLog(getString(R.string.res_not_support));
            return;
        }
        singleThreadExecutor.submit(new Runnable() {
            @Override
            public void run() {
                int ret = 0;
                try {
                    if (!printerService.hasLabelLearning()) {
                        // label learning
                        ret = printerService.labelDetectAuto();
                    }
                    if (ret == 0) {
                        ret = printerService.labelLocateAuto();
                        if (ret == 0) {
                            PrintTextFormat format = new PrintTextFormat();
                            printerService.printText("\nModel:\t\tNB55", format);
                            printerService.printBarcode("1234567890987654321", 320, 90, 2, 0);
                            String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
                            printerService.printText("Time:\t\t" + date, format);
                            printerService.labelPrintEnd();
                        }
                    }
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
//                showLog("Label learning print: " + msg(ret));
            }
        });
    }

    public void scan() {
        if (!existApp("net.nyx.scanner")) {
//            showLog("未安装scanner app");
            return;
        }
        Intent intent = new Intent();
        intent.setComponent(new ComponentName("net.nyx.scanner",
                "net.nyx.scanner.ScannerActivity"));
        // set the capture activity actionbar title
        intent.putExtra("TITLE", "Scan");
        // show album icon, default true
        // intent.putExtra("SHOW_ALBUM", true);
        // play beep sound when get the scan result, default true
        // intent.putExtra("PLAY_SOUND", true);
        // play vibrate when get the scan result, default true
        // intent.putExtra("PLAY_VIBRATE", true);
        startActivityForResult(intent, RC_SCAN);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == RC_SCAN && resultCode == RESULT_OK && data != null) {
            String result = data.getStringExtra("SCAN_RESULT");
//            showLog("Scanner result: " + result);
        }
    }

    boolean existApp(String pkg) {
        try {
            return getPackageManager().getPackageInfo(pkg, 0) != null;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return false;
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

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbindService();
        unregisterQscReceiver();
    }
}

