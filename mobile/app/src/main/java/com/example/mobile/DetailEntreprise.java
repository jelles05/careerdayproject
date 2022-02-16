package com.example.mobile;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.mobile.entities.Entreprise;
import com.example.mobile.managers.AsyncTaskManager;
import com.example.mobile.managers.FetchManager;
import com.example.mobile.views.TextFieldView;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.views.YouTubePlayerView;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class DetailEntreprise extends AppCompatActivity {
    private static final String TAG = "debug";

    TextView entrepriseName;
    ImageView imgLogoEntreprise;
    ImageView img;
    TextFieldView aboutUsContainer;
    TextView tvDescription;
    TextFieldView missionContainer;
    TextView tvMission;
    TextFieldView lookingForContainer;
    TextView tvTargetEmploye;

    ArrayList<Entreprise> entreprises;

    ArrayList<TextView> UiElement = null;
    ArrayList<Method> methodArray = null;
    String idEntreprise;
    String url;
    //vid
    //YouTubePlayerView youTubePlayerView;
    //String videoId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_entreprise);

        getExtra(savedInstanceState);
        initFieldView();
        initArrays();

        try {
            entreprises = FetchManager.fetchEntreprises(idEntreprise);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        implementeUI(entreprises.get(0));
        //entrepriseVideoContainer();
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }

    private void initFieldView() {
        aboutUsContainer = findViewById(R.id.text_field_container1);
        missionContainer = findViewById(R.id.text_field_container2);
        lookingForContainer = findViewById(R.id.text_field_container3);

        entrepriseName = findViewById(R.id.name_entreprise_tv);
        imgLogoEntreprise = findViewById(R.id.image_logo_entreprise);
        tvDescription = aboutUsContainer.findViewById(R.id.text_field_area);
        tvMission = missionContainer.findViewById(R.id.text_field_area);
        tvTargetEmploye = lookingForContainer.findViewById(R.id.text_field_area);
    }

    private void initArrays() {
        UiElement = new ArrayList<>();
        methodArray = new ArrayList<>();
        entreprises = new ArrayList<>();
        UiElement.add(entrepriseName);
        UiElement.add(tvDescription);
        UiElement.add(tvTargetEmploye);
        UiElement.add(tvMission);
        try {
            methodArray.add(Entreprise.class.getMethod("getName"));
            methodArray.add(Entreprise.class.getMethod("getDescription"));
            methodArray.add(Entreprise.class.getMethod("getEmployee_target"));
            methodArray.add(Entreprise.class.getMethod("getMission"));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    private void getExtra(Bundle intentExtra) {
        intentExtra = getIntent().getExtras();
        if (intentExtra != null) {
            idEntreprise = intentExtra.getString("identreprisekey");
            url = intentExtra.getString("urlkey");

            img = findViewById(R.id.image_logo_entreprise);
            new DownloadImageTask(img)
                .execute("https://projetfinalheroku.s3.us-east-2.amazonaws.com/"+url);
        }
    }
    //vid?
    private void implementeUI(Entreprise entreprise) {
        AsyncTaskManager.afficherUI(UiElement, methodArray, entreprise);
        //entreprise.setVideoId(getEmbebVideoID(entreprise));

        // load image
        try {
            // get input stream
            String path = entreprise.getLogo_url();
            Log.d(TAG, "implementeUI: DETAIL ENTREPRISE " + path);
            InputStream ims = getAssets().open(path);
            // load image as Drawable
            Drawable d = Drawable.createFromStream(ims, null);
            // set image to ImageView
            imgLogoEntreprise.setImageDrawable(d);
        } catch (IOException ignored) {
        }
    }
    /*vid
    private String getEmbebVideoID(Entreprise entreprise) {
        String path = entreprise.getVideo_url();
        int pathLenght;
        pathLenght = path.length();
        int lastSpliterIndex = path.lastIndexOf("/");
        return path.substring(lastSpliterIndex + 1, pathLenght);
    }

    private void entrepriseVideoContainer() {
        youTubePlayerView = findViewById(R.id.youtube_player_view);
        getLifecycle().addObserver(youTubePlayerView);

        youTubePlayerView.addYouTubePlayerListener(new AbstractYouTubePlayerListener() {
            @Override
            public void onReady(YouTubePlayer youTubePlayer) {
                super.onReady(youTubePlayer);
                videoId = entreprises.get(0).getVideoId();
                youTubePlayer.loadVideo(videoId, 0);
                youTubePlayer.pause();
            }
        });
    }
    */
}