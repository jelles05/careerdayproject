package com.example.mobile.views;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.mobile.R;

public class TextFieldView extends LinearLayout {
    TextView titleTv;
    TextView textFieldAreaTv;


    public TextFieldView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(getContext()).inflate(R.layout.layout_text_field_view, this);

        titleTv = findViewById(R.id.title_text_field);
        textFieldAreaTv = findViewById(R.id.text_field_area);

        TypedArray attributPerso = context.obtainStyledAttributes(attrs, R.styleable.TextFieldView);
        String title = attributPerso.getString(R.styleable.TextFieldView_title);
        String textContent = attributPerso.getString(R.styleable.TextFieldView_text_area);

        titleTv.setText(title);
        textFieldAreaTv.setText(textContent);

    }
}
