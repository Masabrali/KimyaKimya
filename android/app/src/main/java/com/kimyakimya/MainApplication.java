package com.kimyakimya;

import android.app.Application;

import android.content.IntentFilter;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.imagepicker.ImagePickerPackage;
import com.ianlin.RNCarrierInfo.RNCarrierInfoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;

import io.rumors.reactnativesettings.RNSettingsPackage;
import io.rumors.reactnativesettings.receivers.GpsLocationReceiver;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
              new SplashScreenReactPackage(),
              new SmsListenerPackage(),
              new ImagePickerPackage(),
              new RNCarrierInfoPackage(),
              new RNDeviceInfo(),
              new AndroidKeyboardAdjustPackage(),
              new ReactNativeContacts(),
              new RNSettingsPackage(),
              new MapsPackage(),
              new RNGooglePlacesPackage(),
              new RNFirebasePackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseDatabasePackage(),
              new RNFirebaseFunctionsPackage()
        );
    }

    @Override
    protected String getJSMainModuleName() {
        return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  // @Override
  // public boolean clearHostOnActivityDestroy() {
  //     return false;
  // }

  @Override
  public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);

      registerReceiver(new GpsLocationReceiver(), new IntentFilter("android.location.PROVIDERS_CHANGED"));
  }
}
