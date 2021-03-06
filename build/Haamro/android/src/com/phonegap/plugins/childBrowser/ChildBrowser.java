/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2011, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */
package com.phonegap.plugins.childBrowser;

import java.io.IOException;
import java.io.InputStream;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.GradientDrawable.Orientation;
import android.net.Uri;
import android.text.InputType;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.WindowManager.LayoutParams;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class ChildBrowser extends Plugin {

    protected static final String LOG_TAG = "ChildBrowser";
    private static int CLOSE_EVENT = 0;
    private static int LOCATION_CHANGED_EVENT = 1;
    private static int SENCHA_TOUCH_DARK_BLUE = 0xff11598c;
    private static int SENCHA_TOUCH_MED_BLUE = 0xff1676b9;
    private static int SENCHA_TOUCH_LGT_BLUE = 0xff1e93e4;
    private static int SENCHA_TOUCH_DARK_BUTTON = 0xff0e4b75;
    private static int SENCHA_TOUCH_MED_BUTTON = 0xff1468a2;
    private static int SENCHA_TOUCH_LGT_BUTTON = 0xff1985d0;
    private static int SENCHA_TOUCH_DARK_BUTTON_BG = 0xff061f31;
    private static String ROOT_IMAGE_RESOURCES = "www/resources/images/childbrowser/";
    private static String LEFT_ARROW_ICON = ROOT_IMAGE_RESOURCES + "icon_arrow_left.png";
    private static String RIGHT_ARROW_ICON = ROOT_IMAGE_RESOURCES + "icon_arrow_right.png";
    private static String CLOSE_ICON = ROOT_IMAGE_RESOURCES + "icon_close.png";
    private static String LOADER_IMAGE =  ROOT_IMAGE_RESOURCES + "loader.png";
    private static String CHROME_NEX_7_USER_AGENT = "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19";

    private String browserCallbackId = null;

    private Dialog dialog;
    private WebView webview;
    private EditText edittext;
    private boolean showLocationBar = true;
    private boolean showLoadingIndicator = true;
    private boolean showLightToolbar = false;
    
    /* Progress bar*/
    private Dialog dialog_p;
    private TextView urltext;


    /**
     * Executes the request and returns PluginResult.
     *
     * @param action        The action to execute.
     * @param args          JSONArry of arguments for the plugin.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              A PluginResult object with a status and message.
     */
    public PluginResult execute(String action, JSONArray args, String callbackId) {
        PluginResult.Status status = PluginResult.Status.OK;
        String result = "";

        try {
            if (action.equals("showWebPage")) {
                this.browserCallbackId = callbackId;

                // If the ChildBrowser is already open then throw an error
                if (dialog != null && dialog.isShowing()) {
                    return new PluginResult(PluginResult.Status.ERROR, "ChildBrowser is already open");
                }

                result = this.showWebPage(args.getString(0), args.optJSONObject(1));

                if (result.length() > 0) {
                    status = PluginResult.Status.ERROR;
                    return new PluginResult(status, result);
                } else {
                    PluginResult pluginResult = new PluginResult(status, result);
                    pluginResult.setKeepCallback(true);
                    return pluginResult;
                }
            }
            else if (action.equals("close")) {
                closeDialog();

                JSONObject obj = new JSONObject();
                obj.put("type", CLOSE_EVENT);

                PluginResult pluginResult = new PluginResult(status, obj);
                pluginResult.setKeepCallback(false);
                return pluginResult;
            }
            else if (action.equals("openExternal")) {
                result = this.openExternal(args.getString(0), args.optBoolean(1));
                if (result.length() > 0) {
                    status = PluginResult.Status.ERROR;
                }
            }
            else {
                status = PluginResult.Status.INVALID_ACTION;
            }
            return new PluginResult(status, result);
        } catch (JSONException e) {
            return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
        }
    }

    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param usePhoneGap   Load url in PhoneGap webview
     * @return              "" if ok, or error message.
     */
    public String openExternal(String url, boolean usePhoneGap) {
        try {
            Intent intent = null;
            if (usePhoneGap) {
                intent = new Intent().setClass(this.cordova.getActivity(), org.apache.cordova.DroidGap.class);
                intent.setData(Uri.parse(url)); // This line will be removed in future.
                intent.putExtra("url", url);

                // Timeout parameter: 60 sec max - May be less if http device timeout is less.
                intent.putExtra("loadUrlTimeoutValue", 60000);

                // These parameters can be configured if you want to show the loading dialog
                intent.putExtra("loadingDialog", "Wait,Loading web page...");   // show loading dialog
                intent.putExtra("hideLoadingDialogOnPageLoad", true);           // hide it once page has completely loaded
            }
            else {
                intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
            }
            this.cordova.getActivity().startActivity(intent);
            return "";
        } catch (android.content.ActivityNotFoundException e) {
            Log.d(LOG_TAG, "ChildBrowser: Error loading url "+url+":"+ e.toString());
            return e.toString();
        }
    }

    /**
     * Closes the dialog
     */
    private void closeDialog() {

    	if (dialog_p != null) {
    		/* Progress Bar */
            dialog_p.dismiss();
        }
    	
        if (dialog != null) {
            dialog.dismiss();
        }
    }

    /**
     * Checks to see if it is possible to go back one page in history, then does so.
     */
    private void goBack() {
        if (this.webview.canGoBack()) {
            this.webview.goBack();
        }
    }

    /**
     * Checks to see if it is possible to go forward one page in history, then does so.
     */
    private void goForward() {
        if (this.webview.canGoForward()) {
            this.webview.goForward();
        }
    }

    /**
     * Navigate to the new page
     *
     * @param url to load
     */
    private void navigate(String url) {
        InputMethodManager imm = (InputMethodManager)this.cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(edittext.getWindowToken(), 0);

        if (!url.startsWith("http") && !url.startsWith("file:")) {
            this.webview.loadUrl("http://" + url);
        } else {
            this.webview.loadUrl(url);
        }
        this.webview.requestFocus();
    }


    /**
     * Should we show the location bar?
     *
     * @return boolean
     */
    private boolean getShowLocationBar() {
        return this.showLocationBar;
    }
    
    /**
     * Should we show the loading indicator?
     *
     * @return boolean
     */
    private boolean getShowLoadingIndicator() {
        return this.showLoadingIndicator;
    }
    
    private boolean getShowLightToolbar() {
        return this.showLightToolbar;
    }

    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param jsonObject
     */
    public String showWebPage(final String url, JSONObject options) {
        // Determine if we should hide the location bar.
        if (options != null) {
            showLocationBar = options.optBoolean("showLocationBar", true);
            showLoadingIndicator = options.optBoolean("showLoadingIndicator", true);
            showLightToolbar = options.optBoolean("showLightToolbar", false);
        }

        // Create dialog in new thread
        Runnable runnable = new Runnable() {
            /**
             * Convert our DIP units to Pixels
             *
             * @return int
             */
            private int dpToPixels(int dipValue) {
                int value = (int) TypedValue.applyDimension( TypedValue.COMPLEX_UNIT_DIP,
                                                            (float) dipValue,
                                                            cordova.getActivity().getResources().getDisplayMetrics()
                );

                return value;
            }

            public void run() {
                // Let's create the main dialog
                dialog = new Dialog(cordova.getActivity(), android.R.style.Theme_NoTitleBar);
                dialog.getWindow().getAttributes().windowAnimations = android.R.style.Animation_Dialog;
                dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                dialog.setCancelable(true);
                dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                        public void onDismiss(DialogInterface dialog) {
                            try {
                                JSONObject obj = new JSONObject();
                                obj.put("type", CLOSE_EVENT);

                                sendUpdate(obj, false);
                            } catch (JSONException e) {
                                Log.d(LOG_TAG, "Should never happen");
                            }
                        }
                });

                // Main container layout
                LinearLayout main = new LinearLayout(cordova.getActivity());
                main.setOrientation(LinearLayout.VERTICAL);

                // Toolbar layout
                RelativeLayout toolbar = new RelativeLayout(cordova.getActivity());
                toolbar.setLayoutParams(new RelativeLayout.LayoutParams(LayoutParams.FILL_PARENT, this.dpToPixels(44)));
                toolbar.setPadding(this.dpToPixels(2), this.dpToPixels(2), this.dpToPixels(2), this.dpToPixels(2));
                toolbar.setHorizontalGravity(Gravity.RIGHT);
                toolbar.setVerticalGravity(Gravity.CENTER_VERTICAL);
                
                GradientDrawable toolbarGradient;
                if (getShowLightToolbar()) {
                	toolbarGradient = new GradientDrawable(Orientation.BOTTOM_TOP, new int[] { SENCHA_TOUCH_LGT_BLUE, SENCHA_TOUCH_MED_BLUE });
                } else {
                	toolbarGradient = new GradientDrawable(Orientation.BOTTOM_TOP, new int[] { SENCHA_TOUCH_MED_BLUE, SENCHA_TOUCH_DARK_BLUE });
                }
                toolbarGradient.setGradientType(GradientDrawable.LINEAR_GRADIENT);
                toolbar.setBackgroundDrawable(toolbarGradient);

                // Action Button Container layout
                RelativeLayout actionButtonContainer = new RelativeLayout(cordova.getActivity());
                actionButtonContainer.setLayoutParams(new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
                actionButtonContainer.setHorizontalGravity(Gravity.LEFT);
                actionButtonContainer.setVerticalGravity(Gravity.CENTER_VERTICAL);
                actionButtonContainer.setId(1);
                
                // Back button
                ImageButton back = new ImageButton(cordova.getActivity());
                RelativeLayout.LayoutParams backLayoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.FILL_PARENT);
                backLayoutParams.addRule(RelativeLayout.ALIGN_LEFT);
                back.setLayoutParams(backLayoutParams);
                back.setContentDescription("Back Button");
                back.setId(2);
                try {
                    back.setImageBitmap(loadDrawable(LEFT_ARROW_ICON));
                    back.getBackground().setAlpha(0);
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                back.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        goBack();
                    }
                });

                // Forward button
                ImageButton forward = new ImageButton(cordova.getActivity());
                RelativeLayout.LayoutParams forwardLayoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.FILL_PARENT);
                forwardLayoutParams.addRule(RelativeLayout.RIGHT_OF, 2);
                forward.setLayoutParams(forwardLayoutParams);
                forward.setContentDescription("Forward Button");
                forward.setId(3);
                try {
                    forward.setImageBitmap(loadDrawable(RIGHT_ARROW_ICON));
                    forward.getBackground().setAlpha(0);
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                forward.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        goForward();
                    }
                });

                // Edit Text Box
                edittext = new EditText(cordova.getActivity());
                RelativeLayout.LayoutParams textLayoutParams = new RelativeLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT);
                textLayoutParams.addRule(RelativeLayout.RIGHT_OF, 1);
                textLayoutParams.addRule(RelativeLayout.LEFT_OF, 5);
                edittext.setLayoutParams(textLayoutParams);
                edittext.setId(4);
                edittext.setSingleLine(true);
                edittext.setText(url);
                edittext.setInputType(InputType.TYPE_TEXT_VARIATION_URI);
                edittext.setImeOptions(EditorInfo.IME_ACTION_GO);
                edittext.setInputType(InputType.TYPE_NULL); // Will not except input... Makes the text NON-EDITABLE
                edittext.setOnKeyListener(new View.OnKeyListener() {
                    public boolean onKey(View v, int keyCode, KeyEvent event) {
                        // If the event is a key-down event on the "enter" button
                        if ((event.getAction() == KeyEvent.ACTION_DOWN) && (keyCode == KeyEvent.KEYCODE_ENTER)) {
                          navigate(edittext.getText().toString());
                          return true;
                        }
                        return false;
                    }
                });

                // Close button
                ImageButton close = new ImageButton(cordova.getActivity());
                RelativeLayout.LayoutParams closeLayoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.FILL_PARENT);
                closeLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                close.setLayoutParams(closeLayoutParams);
                forward.setContentDescription("Close Button");
                close.setId(5);
                try {
                    close.setImageBitmap(loadDrawable(CLOSE_ICON));
                    close.getBackground().setAlpha(0);
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                close.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        closeDialog();
                    }
                });

                // Done Button
                Button done = new Button(cordova.getActivity());
                GradientDrawable doneButtonGradient = new GradientDrawable(Orientation.TOP_BOTTOM, new int[] { SENCHA_TOUCH_MED_BUTTON, SENCHA_TOUCH_DARK_BUTTON });
                doneButtonGradient.setGradientType(GradientDrawable.LINEAR_GRADIENT);
                GradientDrawable doneGradientMutated = (GradientDrawable) doneButtonGradient.mutate();
                doneGradientMutated.setCornerRadius(Float.parseFloat(dpToPixels(5) + ""));
                doneGradientMutated.setStroke(dpToPixels(1), SENCHA_TOUCH_DARK_BUTTON_BG);
                done.setBackgroundDrawable(doneGradientMutated);
                RelativeLayout.LayoutParams doneLayoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, dpToPixels(30));
                //doneLayoutParams.addRule(RelativeLayout.CENTER_IN_PARENT);
                //doneLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                done.setLayoutParams(doneLayoutParams);
                done.setPadding(dpToPixels(9), dpToPixels(1), dpToPixels(9), dpToPixels(1));
                done.setText("Done");
                done.setTextColor(Color.WHITE);
                done.setId(6);
                done.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        closeDialog();
                    }
                });
                
                // WebView
                webview = new WebView(cordova.getActivity());
                webview.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));
                webview.setWebChromeClient(new WebChromeClient());
                WebViewClient client = new ChildBrowserClient(edittext);
                webview.setWebViewClient(client);
                WebSettings settings = webview.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setBuiltInZoomControls(true);
                //settings.setPluginsEnabled(true);
                settings.setPluginState(PluginState.ON);
                settings.setDomStorageEnabled(true);
                webview.loadUrl(url);
                webview.setId(7);
                webview.getSettings().setLoadWithOverviewMode(true);
                webview.getSettings().setUseWideViewPort(true);
                webview.getSettings().setUserAgentString(CHROME_NEX_7_USER_AGENT);
                webview.requestFocus();
                webview.requestFocusFromTouch();

                // Add the back and forward buttons to our action button container layout
                actionButtonContainer.addView(back);
                actionButtonContainer.addView(forward);

                // Add the views to our toolbar
                //toolbar.addView(actionButtonContainer);
                //toolbar.addView(edittext);
                //toolbar.addView(close);
                toolbar.addView(done);

                // Don't add the toolbar if its been disabled
                if (getShowLocationBar()) {
                    // Add our toolbar to our main view/layout
                    main.addView(toolbar);
                }

                // Add our webview to our main view/layout
                main.addView(webview);

                WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
                lp.copyFrom(dialog.getWindow().getAttributes());
                lp.width = WindowManager.LayoutParams.FILL_PARENT;
                lp.height = WindowManager.LayoutParams.FILL_PARENT;

                dialog.setContentView(main);
                
                /* Progress Bar */
                dialog_p = new Dialog(ctx.getContext(), android.R.style.Theme_Translucent_NoTitleBar); 
                
                LinearLayout progressbar = new LinearLayout(ctx.getContext());
                progressbar.setOrientation(LinearLayout.HORIZONTAL);
                progressbar.setBackgroundColor(Color.rgb(240, 240, 240));
                progressbar.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.FILL_PARENT));
                urltext = new TextView(ctx.getContext());
                urltext.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.FILL_PARENT, 1.0f));
                urltext.setTextColor(Color.GRAY);
                ImageView image = new ImageView(ctx.getContext());
                try{
                	image.setImageBitmap(loadDrawable(LOADER_IMAGE));
	            } catch (IOException e) {
	                Log.e(LOG_TAG, e.getMessage(), e);
	            }

                float ROTATE_FROM = 0.0f; // from what position you want to rotate it
                float ROTATE_TO = 10.0f * 360.0f; // how many times you want it to rotate in one 'animation' (in this example you want to fully rotate -360 degrees- it 10 times)

                RotateAnimation r = new RotateAnimation(ROTATE_FROM, ROTATE_TO, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
                r.setDuration(7500); // here you determine how fast you want the image to rotate
                r.setRepeatCount(Animation.INFINITE); // how many times you want to repeat the animation
                r.setInterpolator(new LinearInterpolator()); // the curve of the animation; use LinearInterpolator to keep a consistent speed all the way

                image.startAnimation(r);
                progressbar.addView(urltext);
                progressbar.addView(image);
                dialog_p.setContentView(progressbar);
                
                
                WindowManager.LayoutParams lpd = dialog_p.getWindow().getAttributes();
                lpd.width = WindowManager.LayoutParams.FILL_PARENT;
                lpd.height = 40;
                dialog_p.getWindow().setAttributes(lpd);
                dialog_p.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL, WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL);
                dialog_p.getWindow().setFlags(WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH, WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH);
                dialog_p.setCancelable(true);
                dialog_p.setCanceledOnTouchOutside(true);
                dialog_p.getWindow().setGravity(Gravity.BOTTOM);
                

                
                dialog.show();
                dialog.getWindow().setAttributes(lp);
            }

          private Bitmap loadDrawable(String filename) throws java.io.IOException {
              InputStream input = cordova.getActivity().getAssets().open(filename);
              return BitmapFactory.decodeStream(input);
          }
        };
        this.cordova.getActivity().runOnUiThread(runnable);
        return "";
    }

    /**
     * Create a new plugin result and send it back to JavaScript
     *
     * @param obj a JSONObject contain event payload information
     */
    private void sendUpdate(JSONObject obj, boolean keepCallback) {
        if (this.browserCallbackId != null) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
            result.setKeepCallback(keepCallback);
            this.success(result, this.browserCallbackId);
        }
    }

    /**
     * The webview client receives notifications about appView
     */
    public class ChildBrowserClient extends WebViewClient {
        EditText edittext;

        /**
         * Constructor.
         *
         * @param mContext
         * @param edittext
         */
        public ChildBrowserClient(EditText mEditText) {
            this.edittext = mEditText;
        }

        /**
         * Notify the host application that a page has started loading.
         *
         * @param view          The webview initiating the callback.
         * @param url           The url of the page.
         */
        @Override
        public void onPageStarted(WebView view, String url,  Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            String newloc;
            if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("file:")) {
                newloc = url;
            } else {
                newloc = "http://" + url;
            }

            if (!newloc.equals(edittext.getText().toString())) {
                edittext.setText(newloc);
            }

            try {
                JSONObject obj = new JSONObject();
                obj.put("type", LOCATION_CHANGED_EVENT);
                obj.put("location", url);

                sendUpdate(obj, true);
            } catch (JSONException e) {
                Log.d("ChildBrowser", "This should never happen");
            }
            
            /* Progress Bar */
            if(dialog.isShowing() && getShowLoadingIndicator()) {
	            try{
	        		urltext.setText(url.substring(0, 30)+"  ...   ");
	        	} catch (IndexOutOfBoundsException e) {
	        		urltext.setText(url);
	        	}
	        	if(url.indexOf("http") != -1 && dialog_p != null) {
	        		dialog_p.show();
	            }
	        	if(url.indexOf("file") != -1 && dialog_p!=null) {
	        		dialog_p.hide();
	            }
	        }
        }

        @Override
        public void onPageFinished(WebView view, String url){
        	/* Hide ProgressBar on Page Load */
        	if(dialog_p!=null){
        		dialog_p.hide();
        	}
        }
    }
}