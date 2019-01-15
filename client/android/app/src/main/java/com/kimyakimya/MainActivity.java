package com.kimyakimya;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override

    protected void onCreate(Bundle savedInstanceState) {

        SplashScreen.show(this, R.style.SplashScreenTheme);

        super.onCreate(savedInstanceState);

        Fabric.with(this, new Crashlytics());
    }

    @Override

    // public void invokeDefaultOnBackPressed() {
    //
    //     // super.onBackPressed();
    //
    //     this.moveTaskToBack(true);
    // }

    protected String getMainComponentName() {
        return "KimyaKimya";
    }
}
