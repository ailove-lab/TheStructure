// Decompiled by DJ v3.12.12.96 Copyright 2011 Atanas Neshkov  Date: 07.09.2013 2:22:06
// Home Page: http://members.fortunecity.com/neshkov/dj.html  http://www.neshkov.com/dj.html - Check often for new version!
// Decompiler options: fullnames nonlb 

import java.applet.Applet;
import java.awt.Color;
import java.awt.Component;
import java.awt.Container;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.InputEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.awt.image.AreaAveragingScaleFilter;
import java.awt.image.BufferedImage;
import java.awt.image.FilteredImageSource;
import java.awt.image.WritableRaster;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.Socket;
import java.net.URL;
import netscape.javascript.JSObject;

public class websdrwaterfall extends java.applet.Applet
    implements java.lang.Runnable, java.awt.event.ComponentListener, java.awt.event.MouseWheelListener, java.awt.event.MouseListener, java.awt.event.MouseMotionListener {

    public websdrwaterfall() {
        OOOOO0 = true;
        OOO = null;
        OO0 = null;
        OOOOOO_java_awt_Color_fld = new Color(0, 0, 64);
        OOO00O = new int[256];
        OOO0O0 = new int[256];
        OOO0OO = new int[256];
        O0OO = false;
        O00O = 0;
        OOO0 = 0;
        O0O0 = 0;
        OO00 = 0;
        O000 = 0;
        OOOOO = -1;
        O0OOO = -1;
        OO0OO = false;
        O0O0O = 0;
        OO00O = 0;
        OOOO0 = 0;
        O0OO0 = 0;
        OO0O0 = 0;
        O00O0 = 0;
        OOO00 = 1;
        OOO000 = new byte[1024];
        OOOO0O = new float[1024];
        OOOO00 = true;
        OO000 = 0;
        O0000 = 4;
        OOOOOO_int_fld = 0;
        O0OOOO = 0;
        OO0OOO = 0;
        O00OOO = 0;
    }

    public void componentResized(java.awt.event.ComponentEvent componentevent) {
        O0OO = true;
    }

    public void componentShown(java.awt.event.ComponentEvent componentevent) {
    }

    public void componentHidden(java.awt.event.ComponentEvent componentevent) {
    }

    public void componentMoved(java.awt.event.ComponentEvent componentevent) {
    }

    public void start() {
        addComponentListener(this);
        O00O0 = getHeight();
        try {
            O0OOO = java.lang.Integer.valueOf(getParameter("id")).intValue();
            O0O0 = java.lang.Integer.valueOf(getParameter("maxzoom")).intValue();
            OOOOO = java.lang.Integer.valueOf(getParameter("format")).intValue();
        }
        catch(java.lang.Exception _ex) { }
        O0OO0 = java.lang.Integer.valueOf(getParameter("maxh")).intValue();
        if(O0OO0 < O00O0)
            O0OO0 = O00O0;
        OOOO0 = getWidth();
        OO0 = createImage(OOOO0, O0OO0);
        O0 = OO0.getGraphics();
        O0.setColor(java.awt.Color.blue);
        O0.fillRect(0, 0, OOOO0, O0OO0);
        OOO = new BufferedImage(OOOO0, 1, 1);
        O0O = OOO.getRaster();
        addMouseWheelListener(this);
        addMouseListener(this);
        addMouseMotionListener(this);
        try {
            int i = getCodeBase().getPort();
            if(i < 0)
                i = 80;
            O00 = new Socket(getCodeBase().getHost(), i);
            OOOO = O00.getInputStream();
            OO = O00.getOutputStream();
            java.lang.String s = "GET " + getParameter("rq") + (OOOOO < 0 ? "" : "?format=" + OOOOO) + "\r\n\r\n";
            OO.write(s.getBytes(), 0, s.length());
        }
        catch(java.lang.Exception _ex) {
            java.lang.System.out.print("write failed\n");
            return;
        }
        for(int i1 = 0; i1 < 1024; i1 += 4) {
            int k;
            int l;
            int j = k = l = 0;
            switch(i1 >> 8) {
            case 0: // '\0'
                l = i1 / 2;
                break;

            case 1: // '\001'
                l = 128 + (i1 - 256) / 2;
                j = (3 * (i1 - 256)) / 4;
                break;

            case 2: // '\002'
                l = 128 + (767 - i1) / 2;
                j = 192 + (i1 - 512) / 4;
                k = (int)(256D * java.lang.Math.sqrt((double)(i1 - 512) / 256D));
                break;

            case 3: // '\003'
                l = 128 + (i1 - 768) / 2;
                j = 255;
                k = 255;
                break;
            }
            OOO00O[i1 / 4] = j;
            OOO0O0[i1 / 4] = k;
            OOO0OO[i1 / 4] = l;
        }

        O = new Thread(this);
        O.start();
        netscape.javascript.JSObject.getWindow(this).eval("waterfallappletstarted(" + O0OOO + ")");
    }

    public void stop() {
        OOOOO0 = false;
        try {
            O00.close();
        }
        catch(java.lang.Exception _ex) { }
        O = null;
    }

    public void destroy() {
        stop();
    }

    public void setSize(int i, int j) {
        super.setSize(i, j);
        validate();
    }

    public void setband(int i, int j, int k, int l) {
        O00O = k;
        OOO0 = k;
        OO00 = l;
        O000 = l;
        O0O0 = j;
        i = "GET /~~waterparam?band=" + i + "&zoom=" + O00O + "&start=" + OO00 + "\r\n\r\n";
        try {
            OO.write(i.getBytes(), 0, i.length());
        }
        catch(java.lang.Exception _ex) { }
    }

    public void setslow(int i) {
        i = "GET /~~waterparam?slow=" + i + "\r\n\r\n";
        try {
            OO.write(i.getBytes(), 0, i.length());
        }
        catch(java.lang.Exception _ex) { }
    }

    void O() {
        netscape.javascript.JSObject jsobject = netscape.javascript.JSObject.getWindow(this);
        jsobject.eval("zoomchange(" + O0OOO + "," + O00O + "," + OO00 + ")");
    }

    void O(int i, int j, int k, boolean flag) {
        int j1 = OOOO0;
        int i1 = 0;
        int l = O0OO0 - 0;
        if(k == O00O)
            return;
        if(flag) {
            i1 = OO0O0;
            l = 1;
        }
        OOOO00 = true;
        if(k > O00O) {
            flag = 1 << k - O00O;
            k = ((j - i) * j1) / ((1024 << O0O0 - k) - (1024 << O0O0 - O00O));
            j = k - 1;
            for(i = k - flag; i >= 0;) {
                O0.copyArea(i, i1, 1, l, j - i, 0);
                i -= ((flag) ? 1 : 0);
                j--;
            }

            O0.setColor(java.awt.Color.black);
            O0.fillRect(0, i1, j + 1, l);
            i = k + 1;
            for(j = k + flag; j < j1;) {
                O0.copyArea(j, i1, 1, l, i - j, 0);
                j += ((flag) ? 1 : 0);
                i++;
            }

            O0.fillRect(i, i1, j1 - i, l);
        } else {
            flag = 1 << O00O - k;
            int k1 = ((j - i) * j1) / 1024 >> O0O0 - k;
            k = k1;
            for(j = 0; j < k; k++)
                for(i = 0; i < flag; i++) {
                    O0.copyArea(k, i1, 1, l, j - k, 0);
                    j++;
                }


            i = (k1 + j1 / flag) - 1;
            for(k = j1 - 1; k >= i; i--)
                for(j = 0; j < flag; j++) {
                    O0.copyArea(i, i1, 1, l, k - i, 0);
                    k--;
                }


        }
    }

    void OO() {
        if(O0O0O == OO00O)
            return;
        int j = O0O0O;
        int i = j - OO00O;
        OO00O = j;
        O0.setColor(java.awt.Color.black);
        if(i > 0) {
            O0.copyArea(0, 0, OOOO0 - i, O0OO0, i, 0);
            O0.fillRect(0, 0, i, O0OO0);
            if(OOO00 == 0)
                java.lang.System.arraycopy(OOOO0O, 0, OOOO0O, i, 1024 - i);
        } else
        if(i < 0) {
            O0.copyArea(-i, 0, OOOO0 + i, O0OO0, i, 0);
            O0.fillRect(OOOO0 + i, 0, -i, O0OO0);
            if(OOO00 == 0)
                java.lang.System.arraycopy(OOOO0O, -i, OOOO0O, 0, 1024 + i);
        }
        O();
    }

    void O(int i, double d) {
        if(O0O0 == 0)
            return;
        int l = O00O;
        int k = OO00;
        int j = OO00 + (int)java.lang.Math.round(d * (double)(1024 << O0O0 - O00O));
        O00O -= i;
        if(O00O < 0)
            O00O = 0;
        if(O00O > O0O0)
            O00O = O0O0;
        d = j - (int)java.lang.Math.round(d * (double)(1024 << O0O0 - O00O));
        if(d < 0)
            d = 0;
        i = (1024 << O0O0) - (1024 << O0O0 - O00O);
        if(d > i)
            d = i;
        OO00 = d;
        O(k, OO00, l, false);
        repaint();
        i = "GET /~~waterparam?zoom=" + O00O + "&start=" + OO00 + "\r\n\r\n";
        try {
            OO.write(i.getBytes(), 0, i.length());
        }
        catch(java.lang.Exception _ex) { }
        O();
    }

    public void mouseWheelMoved(java.awt.event.MouseWheelEvent mousewheelevent) {
        int i = mousewheelevent.getWheelRotation();
        O(i, (double)mousewheelevent.getX() / (double)OOOO0);
        mousewheelevent.consume();
    }

    public void setzoom(int i, int j) {
        if(i == -1) {
            O(1, (double)j / 1024D);
            return;
        }
        if(i == -2) {
            O(-1, (double)j / 1024D);
            return;
        }
        int l = O00O;
        int k = OO00;
        int i1 = i;
        if(i1 < 0)
            i1 = 0;
        if(i1 > O0O0)
            i1 = O0O0;
        if(j < 0)
            j = 0;
        i = (1024 << O0O0) - (1024 << O0O0 - i1);
        if(j > i)
            j = i;
        i = "GET /~~waterparam?zoom=" + i1 + "&start=" + j + "\r\n\r\n";
        O00O = i1;
        OO00 = j;
        O(k, OO00, l, false);
        repaint();
        try {
            OO.write(i.getBytes(), 0, i.length());
        }
        catch(java.lang.Exception _ex) { }
        O();
    }

    public void mousePressed(java.awt.event.MouseEvent mouseevent) {
        if(mouseevent.getButton() == 1) {
            O00OO = mouseevent.getX();
            OOO0O = O00OO;
            OO0OO = true;
            O0O0O = 0;
            OO00O = 0;
            O000O = OO00;
        }
    }

    public void mouseReleased(java.awt.event.MouseEvent mouseevent) {
        if(mouseevent.getButton() == 1 && OO0OO) {
            OO();
            repaint();
        }
    }

    public void mouseEntered(java.awt.event.MouseEvent mouseevent) {
    }

    public void mouseExited(java.awt.event.MouseEvent mouseevent) {
    }

    public void mouseClicked(java.awt.event.MouseEvent mouseevent) {
    }

    public void mouseMoved(java.awt.event.MouseEvent mouseevent) {
    }

    public void mouseDragged(java.awt.event.MouseEvent mouseevent) {
        if(!OO0OO)
            return;
        int k = mouseevent.getX();
        int j = O000O;
        int i = j - ((k - O00OO) * (1024 << O0O0 - O00O)) / OOOO0;
        mouseevent = (1024 << O0O0) - (1024 << O0O0 - O00O);
        O0O0O += k - OOO0O;
        if(i < 0) {
            i = 0;
            O0O0O = ((j - 0) * OOOO0) / 1024 >> O0O0 - O00O;
        } else
        if(i > mouseevent) {
            i = mouseevent;
            O0O0O = ((j - i) * OOOO0) / 1024 >> O0O0 - O00O;
        }
        OO00 = i;
        mouseevent = "GET /~~waterparam?zoom=" + O00O + "&start=" + OO00 + "\r\n\r\n";
        try {
            OO.write(mouseevent.getBytes(), 0, mouseevent.length());
        }
        catch(java.lang.Exception _ex) { }
        OOO0O = k;
    }

    public void setheight(int i) {
        O00O0 = i;
        setSize(OOOO0, i);
    }

    public void setmode(int i) {
        if((OOO00 >= 2 || i >= 2) && OOO00 != i) {
            int j = i;
            if(j == 0)
                j = 1;
            java.lang.String s = "GET /~~waterparam?scale=" + j + "\r\n\r\n";
            try {
                OO.write(s.getBytes(), 0, s.length());
            }
            catch(java.lang.Exception _ex) { }
        }
        if(i == 0 && OOO00 != 0)
            OOOO00 = true;
        OOO00 = i;
    }

    public void paint(java.awt.Graphics g) {
        if(OO0 == null)
            return;
        if(OOO00 == 0) {
            for(int k = 0; k < OOOO0; k++) {
                double d = (1024D / (double)OOOO0) * (double)k;
                int j = (int)d;
                d -= j;
                if(j <= 0)
                    d = 0xff & O0O00[0];
                else
                if(j >= 1023)
                    d = 0xff & O0O00[1023];
                else
                    d = (int)((double)(0xff & O0O00[j + 1]) * d + (double)(0xff & O0O00[j]) * (1.0D - d) + 0.5D);
                d = ((0xff & d) * O00O0) / 256;
                if(d > 0) {
                    g.setColor(java.awt.Color.cyan);
                    g.drawLine(k, O00O0 - 1, k, O00O0 - 1 - d);
                }
                if(d < O00O0) {
                    g.setColor(OOOOOO_java_awt_Color_fld);
                    g.drawLine(k, O00O0 - 1 - d, k, 0);
                }
            }

            return;
        }
        if(O00O0 > O0OO0)
            O00O0 = O0OO0;
        int i = O00O0;
        if(OO0O0 >= i) {
            g.drawImage(OO0, 0, 0, OOOO0, i, 0, OO0O0 - i, OOOO0, OO0O0, this);
        } else {
            g.drawImage(OO0, 0, 0, OOOO0, i - OO0O0, 0, O0OO0 - (i - OO0O0), OOOO0, O0OO0, this);
            g.drawImage(OO0, 0, i - OO0O0, OOOO0, i, 0, 0, OOOO0, OO0O0, this);
        }
    }

    int O(byte abyte0[], int i) {
        int k = 0;
        if(i == 0)
            return 0;
        if(OO000 == 0) {
            O0000 = 4;
            O0O00[0] = (byte)((abyte0[0] & 0xf0) + 8);
            OO000 = 1;
        }
        for(; k != i && OO000 != 1024; OO000++) {
            int j = (abyte0[k] & 0xff) << 8 + O0000 | (abyte0[k + 1] & 0xff) << O0000;
            byte byte0;
            if((j & 0x8000) == 0) {
                byte0 = 0;
                j = 1;
            } else
            if((j & 0xe000) == 32768) {
                byte0 = 1;
                j = 3;
            } else
            if((j & 0xe000) == 40960) {
                byte0 = 15;
                j = 3;
            } else {
                byte0 = OOOOO00[(j & 0x3f00) >> 8][0];
                j = OOOOO00[(j & 0x3f00) >> 8][1];
            }
            if(k == i - 1 && O0000 + j > 8)
                break;
            O0000 += j;
            if(O0000 >= 8) {
                O0000 -= 8;
                k++;
            }
            O0O00[OO000] = (byte)(O0O00[OO000 - 1] + (byte0 << 4));
        }

        if(OO000 == 1024 && O0000 != 0) {
            O0000 = 0;
            k++;
        }
        return k;
    }

    int OO(byte abyte0[], int i) {
        int l = 0;
        if(i == 0)
            return 0;
        if(OO000 == 0) {
            O0000 = 0;
            O0OOOO = 0;
        }
        for(; l != i && OO000 != 1024; OO000++) {
            int j = (abyte0[l] & 0xff) << 8 + O0000 | (abyte0[l + 1] & 0xff) << O0000;
            int k;
            if((j & 0x8000) == 0) {
                k = 0;
                j = 1;
            } else {
                k = OOOO00O[O0OOOO][(j & 0x7f00) >> 8][0];
                j = OOOO00O[O0OOOO][(j & 0x7f00) >> 8][1];
            }
            if(l == i - 1 && O0000 + j > 8)
                break;
            O0000 += j;
            if(O0000 >= 8) {
                O0000 -= 8;
                l++;
            }
            if(k == 1 || k == -1)
                O0OOOO = 1;
            if(k > 1 || k < -1)
                O0OOOO = 2;
            if(k == 0)
                O0OOOO = 0;
            OO0OOO += k << 4;
            j = (OOO000[OO000] & 0xff) + OO0OOO;
            if(j < 0)
                j = 8;
            if(j > 255)
                j = 248;
            O0O00[OO000] = (byte)j;
        }

        if(OO000 == 1024 && O0000 != 0) {
            O0000 = 0;
            l++;
        }
        if(OO000 == 1024) {
            java.lang.System.arraycopy(O0O00, 0, OOO000, 0, 1024);
            OO0OOO = 0;
        }
        return l;
    }

    int O0(byte abyte0[], int i) {
        int k = 0;
        if(i == 0)
            return 0;
        if(OO000 == 0) {
            O0000 = 3;
            O00OOO = 0;
            O0O00[0] = (byte)((abyte0[0] & 0xe0) + 16);
            OO000 = 1;
        }
        for(; k != i && OO000 != 1024; OO000++) {
            int j = (abyte0[k] & 0xff) << 8 + O0000 | (abyte0[k + 1] & 0xff) << O0000;
            byte byte0;
            if((j & 0x8000) == 0) {
                byte0 = 0;
                j = 1;
            } else {
                byte0 = OOOOOOO[O00OOO][(j & 0x7c00) >> 10][0];
                j = OOOOOOO[O00OOO][(j & 0x7c00) >> 10][1];
            }
            if(k == i - 1 && O0000 + j > 8)
                break;
            O0000 += j;
            if(O0000 >= 8) {
                O0000 -= 8;
                k++;
            }
            if(byte0 == 2 || byte0 == 9)
                O00OOO = 1;
            if(byte0 > 2 && byte0 < 9)
                O00OOO = 2;
            if(byte0 == 0)
                O00OOO = 0;
            if(byte0 == 0)
                O0O00[OO000] = O0O00[OO000 - 1];
            else
                O0O00[OO000] = (byte)(O0O00[OO000 - 1] + (byte0 - 2 << 5) + 16);
        }

        if(OO000 == 1024 && O0000 != 0) {
            O0000 = 0;
            k++;
        }
        return k;
    }

    void O(byte abyte0[]) {
        if(abyte0[1] == 1) {
            int i = (abyte0[3] & 0xff) + ((abyte0[4] & 0xff) << 8) + ((abyte0[5] & 0xff) << 16) + ((abyte0[6] & 0xff) << 24);
            abyte0 = abyte0[2];
            OOO0 = abyte0;
            O000 = i;
        }
    }

    public void run() {
        int ai[] = new int[OOOO0 * 3];
        byte abyte0[] = new byte[1024];
        O0O00 = new byte[1024];
        int i4 = 0;
        for(int i = 0; i < 1024; i++)
            OOO000[i] = 8;

        try {
            OOOO.read(O0O00, 0, 1);
        }
        catch(java.lang.Exception _ex) { }
        OOOOO = O0O00[0];
        for(; OOOOO0; repaint()) {
            if(OOOOO < 7) {
                int i3 = -1;
                char c = '\u0400';
                if(OOOOO == 1)
                    c = '\u0200';
                do {
                    if(OO000 >= c)
                        break;
                    try {
                        i3 = OOOO.read(O0O00, OO000, c - OO000);
                    }
                    catch(java.lang.Exception _ex) {
                        i3 = -1;
                        break;
                    }
                    OO000 += i3;
                    if(i3 < 0)
                        break;
                    if(OO000 >= 8 && O0O00[0] == -1) {
                        O(O0O00);
                        for(int j = 0; j < OO000 - 8; j++)
                            O0O00[j] = O0O00[8 + j];

                        OO000 -= 8;
                    }
                } while(true);
                if(i3 < 0)
                    break;
                OO000 = 0;
                if(OOOOO == 1) {
                    for(int k = 511; k >= 0; k--) {
                        O0O00[k * 2] = (byte)(O0O00[k] << 4 | 8);
                        O0O00[k * 2 + 1] = (byte)(O0O00[k] & 0xf0 | 8);
                    }

                }
            } else {
                int j3 = 0;
                boolean flag = false;
                do {
                    if(OO000 >= 1024)
                        break;
                    do {
                        if((OO000 != 0 || i4 >= 8) && !flag)
                            break;
                        try {
                            j3 = OOOO.read(abyte0, i4, 1024 - i4);
                        }
                        catch(java.lang.Exception _ex) {
                            j3 = -1;
                            break;
                        }
                        i4 += j3;
                        flag = false;
                    } while(true);
                    if(j3 < 0)
                        break;
                    if(OO000 == 0 && abyte0[0] == -1)
                        if(abyte0[1] == -1) {
                            for(int l = 0; l < i4 - 1; l++)
                                abyte0[l] = abyte0[1 + l];

                            i4--;
                        } else {
                            O(abyte0);
                            for(int i1 = 0; i1 < i4 - 8; i1++)
                                abyte0[i1] = abyte0[8 + i1];

                            i4 -= 8;
                            continue;
                        }
                    if(OOOOO == 7)
                        j3 = O0(abyte0, i4);
                    else
                    if(OOOOO == 8)
                        j3 = O(abyte0, i4);
                    else
                        j3 = OO(abyte0, i4);
                    if(j3 > 0) {
                        for(int j1 = 0; j1 < i4 - j3; j1++)
                            abyte0[j1] = abyte0[j3 + j1];

                        i4 -= j3;
                    }
                    flag = true;
                } while(true);
                OO000 = 0;
                if(j3 < 0)
                    break;
            }
            if(O0OO) {
                O0OO = false;
                O00O0 = getHeight();
                if(O0OO0 < O00O0)
                    O0OO0 = O00O0;
                OOOO0 = getWidth();
                java.awt.Image image = OO0;
                java.lang.Object obj = new AreaAveragingScaleFilter(OOOO0, O0OO0);
                obj = new FilteredImageSource(image.getSource(), ((java.awt.image.ImageFilter) (obj)));
                obj = createImage(((java.awt.image.ImageProducer) (obj)));
                OO0 = createImage(OOOO0, O0OO0);
                O0 = OO0.getGraphics();
                O0.drawImage(((java.awt.Image) (obj)), 0, 0, OOOO0, O0OO0, 0, 0, OOOO0, O0OO0, this);
                OOO = new BufferedImage(OOOO0, 1, 1);
                O0O = OOO.getRaster();
                ai = new int[OOOO0 * 3];
            }
            if(O00O == OOO0 && OO00 != O000) {
                int k1 = OO00 - O000;
                int l2 = k1 >> O0O0 - O00O;
                if(l2 > 0) {
                    int l1;
                    for(l1 = 0; l1 < 1024 - l2; l1++)
                        O0O00[l1] = O0O00[l1 + l2];

                    for(; l1 < 1024; l1++)
                        O0O00[l1] = 0;

                } else {
                    int i2;
                    for(i2 = 1023; i2 >= -l2; i2--)
                        O0O00[i2] = O0O00[i2 + l2];

                    for(; i2 >= 0; i2--)
                        O0O00[i2] = 0;

                }
            }
            if(OOO00 != 0) {
                for(int l3 = 0; l3 < OOOO0; l3++) {
                    double d = (1024D / (double)OOOO0) * (double)l3;
                    int k3 = (int)d;
                    d -= k3;
                    if(k3 <= 0)
                        d = 0xff & O0O00[0];
                    else
                    if(k3 >= 1023)
                        d = 0xff & O0O00[1023];
                    else
                        d = (int)((double)(0xff & O0O00[k3 + 1]) * d + (double)(0xff & O0O00[k3]) * (1.0D - d) + 0.5D);
                    ai[l3 * 3] = OOO00O[d];
                    ai[l3 * 3 + 1] = OOO0O0[d];
                    ai[l3 * 3 + 2] = OOO0OO[d];
                }

                O0O.setPixels(0, 0, OOOO0, 1, ai);
                if(OO0OO)
                    OO();
                O0.drawImage(OOO, 0, OO0O0, null);
                O(O000, OO00, OOO0, true);
                OO0O0++;
                if(OO0O0 >= O0OO0)
                    OO0O0 = 0;
                continue;
            }
            if(OO0OO)
                OO();
            if(OOOO00) {
                for(int j2 = 0; j2 < 1024; j2++)
                    OOOO0O[j2] = O0O00[j2] & 0xff;

                OOOO00 = false;
                continue;
            }
            for(int k2 = 0; k2 < 1024; k2++) {
                OOOO0O[k2] = 0.5F * (float)(O0O00[k2] & 0xff) + 0.5F * OOOO0O[k2];
                O0O00[k2] = (byte)(int)OOOO0O[k2];
            }

        }

        OO0 = null;
        O0 = null;
        O0O = null;
        OOO = null;
    }

    public void update(java.awt.Graphics g) {
        paint(g);
    }

    public static void O(java.lang.String as[]) {
        java.lang.System.out.println("Copyright 2008-2013, Pieter-Tjerk de Boer, PA3FWM, pa3fwm@websdr.org");
        java.lang.System.out.println("Since the intended use of this (or any) applet involves sending a copy to the client computer, I (PA3FWM) hereby allow making it available unmodified, as part of the original .jar file, via my original WebSDR server software, to WebSDR clients.");
    }

    static final long serialVersionUID = 1L;
    java.lang.Thread O;
    java.io.OutputStream OO;
    boolean OOOOO0;
    java.awt.Graphics O0;
    java.awt.image.BufferedImage OOO;
    java.awt.image.WritableRaster O0O;
    java.awt.Image OO0;
    java.awt.Color OOOOOO_java_awt_Color_fld;
    java.net.Socket O00;
    java.io.InputStream OOOO;
    int OOO00O[];
    int OOO0O0[];
    int OOO0OO[];
    boolean O0OO;
    java.lang.String OO0O;
    int O00O;
    int OOO0;
    int O0O0;
    int OO00;
    int O000;
    int OOOOO;
    int O0OOO;
    boolean OO0OO;
    int O00OO;
    int OOO0O;
    int O0O0O;
    int OO00O;
    int O000O;
    int OOOO0;
    int O0OO0;
    int OO0O0;
    int O00O0;
    int OOO00;
    byte O0O00[];
    byte OOO000[];
    float OOOO0O[];
    boolean OOOO00;
    int OO000;
    byte OOOOO00[][] = {
        {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            2, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            14, 4
        }, {
            3, 6
        }, {
            3, 6
        }, {
            3, 6
        }, {
            3, 6
        }, {
            4, 6
        }, {
            4, 6
        }, {
            4, 6
        }, {
            4, 6
        }, {
            5, 6
        }, {
            5, 6
        }, {
            5, 6
        }, {
            5, 6
        }, {
            11, 6
        }, {
            11, 6
        }, {
            11, 6
        }, {
            11, 6
        }, {
            12, 6
        }, {
            12, 6
        }, {
            12, 6
        }, {
            12, 6
        }, {
            13, 6
        }, {
            13, 6
        }, {
            13, 6
        }, {
            13, 6
        }, {
            6, 7
        }, {
            6, 7
        }, {
            7, 7
        }, {
            7, 7
        }, {
            10, 7
        }, {
            10, 7
        }, {
            8, 8
        }, {
            9, 8
        }
    };
    int O0000;
    int OOOOOO_int_fld;
    int OOOO00O[][][] = {
        {
            {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                -1, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                -3, 4
            }, {
                5, 7
            }, {
                5, 7
            }, {
                7, 7
            }, {
                7, 7
            }, {
                9, 8
            }, {
                11, 8
            }, {
                13, 8
            }, {
                15, 8
            }, {
                -5, 7
            }, {
                -5, 7
            }, {
                -7, 7
            }, {
                -7, 7
            }, {
                -9, 8
            }, {
                -11, 8
            }, {
                -13, 8
            }, {
                -15, 8
            }
        }, {
            {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }, {
                -1, 2
            }
        }, {
            {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                -3, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                5, 3
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                -5, 4
            }, {
                7, 7
            }, {
                7, 7
            }, {
                9, 7
            }, {
                9, 7
            }, {
                11, 7
            }, {
                11, 7
            }, {
                13, 8
            }, {
                15, 8
            }, {
                -7, 7
            }, {
                -7, 7
            }, {
                -9, 7
            }, {
                -9, 7
            }, {
                -11, 7
            }, {
                -11, 7
            }, {
                -13, 8
            }, {
                -15, 8
            }
        }
    };
    int O0OOOO;
    int OO0OOO;
    byte OOOOOOO[][][] = {
        {
            {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                2, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                9, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                8, 4
            }, {
                8, 4
            }, {
                8, 4
            }, {
                8, 4
            }, {
                4, 6
            }, {
                5, 6
            }, {
                6, 6
            }, {
                7, 6
            }
        }, {
            {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                2, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }, {
                9, 2
            }
        }, {
            {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                3, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                8, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                4, 3
            }, {
                7, 4
            }, {
                7, 4
            }, {
                7, 4
            }, {
                7, 4
            }, {
                5, 5
            }, {
                5, 5
            }, {
                6, 5
            }, {
                6, 5
            }
        }
    };
    int O00OOO;
}
