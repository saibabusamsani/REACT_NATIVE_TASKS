package com.jeevika_hrms

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     */
    override fun getMainComponentName(): String = "Jeevika_HRMS"

    /**
     * Returns the instance of the ReactActivityDelegate.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.BootTheme)
        super.onCreate(savedInstanceState)
    }
}