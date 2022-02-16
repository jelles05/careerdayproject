package com.example.mobile.views;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.mobile.R;

import java.util.ArrayList;

public class FieldView extends LinearLayout {
    TextView labelTv;
    TextView valueTv;
    TextView singleFieldTv;
    LinearLayout llContainer;
    LinearLayout llButtons;
    ArrayList<Button> buttons;
    String selectValue;


    public FieldView(Context ctx, @Nullable AttributeSet attrs) {
        super(ctx, attrs);
        LayoutInflater.from(getContext()).inflate(R.layout.layout_field_view, this);
        llContainer = findViewById(R.id.field_container);

        TypedArray attributPerso = ctx.obtainStyledAttributes(attrs, R.styleable.FieldView);
        String label = attributPerso.getString(R.styleable.FieldView_label);
        String value = attributPerso.getString(R.styleable.FieldView_value);
        String singleField = attributPerso.getString(R.styleable.FieldView_single_field);
        int color = attributPerso.getColor(R.styleable.FieldView_color, getResources().getColor(R.color.black));
        labelTv = findViewById(R.id.label_tv);
        valueTv = findViewById(R.id.value_tv);
        valueTv.setText(value);
        labelTv.setText(label);

        if (singleField != null) {
            labelTv.setVisibility(View.GONE);
            valueTv.setVisibility(View.GONE);
            singleFieldTv = new TextView(ctx);
            singleFieldTv.setLayoutParams(new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, 100));
            singleFieldTv.setText(singleField);
            singleFieldTv.setTextColor(getResources().getColor(R.color.white));
            singleFieldTv.setGravity(Gravity.CENTER);
            llContainer.addView(singleFieldTv);
        }

        Log.d("Debug", "attribut perso: " + label + " " + value + " " + color);
        llContainer.setBackgroundColor(color);
    }

    public void setButtons(String... buttonsName) {
        for (String name : buttonsName) {
            Button btn = new Button(getContext());
            buttons.add(btn);
            btn.setLayoutParams(new LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
            btn.setText(name);
            btn.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View view) {
                    selectValue = ((Button) view).getText().toString();
                    for (Button b : buttons) {
                        b.setTextColor(getResources().getColor(R.color.gray_field));
                    }
                    btn.setTextColor(getResources().getColor(R.color.green_plage_horaire));
                }
            });
            llButtons.addView(btn);
        }
    }


    public TextView getValueTv() {
        return valueTv;
    }


    public void setValueTv(TextView valueTv) {
        this.valueTv = valueTv;
    }
}
