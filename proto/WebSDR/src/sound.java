import java.applet.Applet;
import java.awt.Component;
import java.awt.Graphics;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.*;
import java.net.Socket;
import java.net.URL;
import javax.sound.sampled.*;
import netscape.javascript.JSObject;

public class websdrsound extends Applet
    implements LineListener, Runnable, MouseListener
{

    public websdrsound()
    {
        O0O = -2;
        OO0 = -2;
        O00 = -1;
        OOOO = 0;
        O0OO = 0;
        O00O = 0;
        OOO0 = "";
        O0O0 = -1;
        O000 = false;
        OOOOO = true;
        O0OOO = false;
        smeter = -32767;
        OO0OO = 1.0D;
        O00OO = 1.0F;
        OOO0O = 0.0D;
        O0O0O = 0.0D;
        OOOO0 = 1.0F;
        O0OO0 = 0L;
        OOOO00O = 0L;
        OOOO000 = 0.0F;
        OO0O0 = false;
        O00O0 = 5;
        OOO00 = 0.0F;
        O0O00 = 0;
        OO000 = 0.0F;
        OOO0000 = new float[272];
        OOO000O = new float[1552];
        OOO00O0 = new byte[3120];
        O0000 = 1;
        OOO0O00 = new float[20];
        OOOOOO = 1;
        O0OOOO = 0;
    }

    public void stop()
    {
        OO00 = null;
        OOO0 = "stop()";
        O();
    }

    public void destroy()
    {
        stop();
    }

    public void paint(Graphics g)
    {
        g.drawString("WebSDR sound applet", 10, 10);
        g.drawString("Copyright 2007-2013, P.T. de Boer, pa3fwm@websdr.org", 10, 24);
        g.drawString("Java version: " + System.getProperty("java.version"), 10, 88);
        if(OOOOO)
        {
            return;
        } else
        {
            g.drawString(O0O + " " + OOO0 + " " + O000 + " " + O0O0, 10, 40);
            g.drawString(O0OO + " " + OOOO, 10, 52);
            g.drawString(O00O + " " + 200F, 10, 64);
            g.drawString((int)(0.5D + (double)(O00OO * 8000F)) + " " + (int)(0.5D + (OO0OO - 1.0D) * 1000000D) + " " + (int)(0.5D + (1.0D - (O0O0O / 6D / OOO0O) * (double)O00OO) * 1000000D), 10, 76);
            return;
        }
    }

    void O()
    {
        if(OOOOO)
        {
            return;
        } else
        {
            repaint();
            return;
        }
    }

    public void mouseEntered(MouseEvent mouseevent)
    {
    }

    public void mouseExited(MouseEvent mouseevent)
    {
    }

    public void mouseReleased(MouseEvent mouseevent)
    {
    }

    public void mousePressed(MouseEvent mouseevent)
    {
    }

    public void O(MouseEvent mouseevent)
    {
    }

    public void mouseClicked(MouseEvent mouseevent)
    {
        OOOOO = !OOOOO;
        repaint();
    }

    public int getid()
    {
        return O0O0;
    }

    public int OO()
    {
        return smeter;
    }

    public boolean mute()
    {
        O000 = !O000;
        O();
        return O000;
    }

    public String javaversion()
    {
        return System.getProperty("java.version");
    }

    public void setparam(String s)
    {
        s = "GET /~~param?ppm=" + (int)(0.5D + (OO0OO - 1.0D) * 1000000D) + "&ppml=" + (int)(0.5D + (1.0D - (O0O0O / 6D / OOO0O) * (double)O00OO) * 1000000D) + "&" + s + "\r\n\r\n";
        try
        {
            OOO.write(s.getBytes(), 0, s.length());
        }
        catch(Exception _ex) { }
        O0O0O = OOO0O = 0.0D;
    }

    public void setvolume(float f)
    {
        OOOO0 = f;
    }

    public void start()
    {
        AudioFormat audioformat = new AudioFormat(48000F, 16, 1, true, false);
        javax.sound.sampled.DataLine.Info info = new javax.sound.sampled.DataLine.Info(javax.sound.sampled.SourceDataLine.class, audioformat, 0x17700);
        try
        {
            O = (SourceDataLine)AudioSystem.getLine(info);
            O.open(audioformat, 0x17700);
        }
        catch(LineUnavailableException lineunavailableexception)
        {
            System.out.print("sound -> error opening sound system: " + lineunavailableexception + "\n");
        }
        O.addLineListener(this);
        O.start();
        try
        {
            int i = getCodeBase().getPort();
            if(i < 0)
                i = 80;
            OO = new Socket(getCodeBase().getHost(), i);
            O0 = OO.getInputStream();
            OOO = OO.getOutputStream();
            OOO.write("GET /~~stream?format=23\r\n\r\n".getBytes(), 0, 27);
            O0O = 1;
            O();
        }
        catch(Exception exception)
        {
            System.out.print("sound -> error opening TCP connection: " + exception + "\n");
            O0O = -3;
            O();
        }
        O0O = 4;
        OOO0 = "start()";
        OO00 = new Thread(this);
        OO00.start();
        JSObject.getWindow(this).eval("soundappletstarted()");
        addMouseListener(this);
        O();
        O0OO0 = System.currentTimeMillis();
    }

    void O(int i)
    {
        if(O0O0 == -1)
            O0O0 = i;
        else
        if((i & 0x8000) == 0)
        {
            smeter = i;
        } else
        {
            i &= 0x7fff;
            if((i & 0x4000) == 0)
                O00OO = (float)i / 8000F;
        }
    }

    void OO(int i)
    {
        OOO0O += i;
        O00 = O.getBufferSize() - O.available();
        if(!O.isActive())
        {
            OOOO++;
            O00 = -1;
        }
        O0O++;
        OOO0O0O[0] = OOO0O0O[1];
        OOO0O0O[1] = OOO0O0O[2];
        OOO0O0O[2] = (float)O.getFramePosition() / 48F - (float)(System.currentTimeMillis() - O0OO0);
        if(OOO0O0O[1] > OOO0O0O[0] && OOO0O0O[1] > OOO0O0O[2])
            OOO0OO0 = 0.1F * OOO0O0O[1] + 0.9F * OOO0OO0;
        for(int l1 = 0; l1 < i; l1++)
        {
            for(int j1 = 0; j1 < 6; j1++)
            {
                int l = {
                    -0.0030657F, -0.0027421F, -0.0028342F, -0.0018084F, 0.00055067F, 0.0040855F, 0.0081821F, 0.011793F, 0.01366F, 0.01262F, 
                    0.0080115F, 1.7366E-05F, -0.010139F, -0.020236F, -0.027388F, -0.028593F, -0.02145F, -0.0048089F, 0.020752F, 0.052804F, 
                    0.087352F, 0.11948F, 0.14428F, 0.15778F, 0.15778F, 0.14428F, 0.11948F, 0.087352F, 0.052804F, 0.020752F, 
                    -0.0048089F, -0.02145F, -0.028593F, -0.027388F, -0.020236F, -0.010139F, 1.7366E-05F, 0.0080115F, 0.01262F, 0.01366F, 
                    0.011793F, 0.0081821F, 0.0040855F, 0.00055067F, -0.0018084F, -0.0028342F, -0.0027421F, -0.0030657F
                };
                float af[] = {
                    -0.0024615F, -0.0072497F, -0.0080908F, -0.0078587F, -0.0024454F, 0.0045784F, 0.010045F, 0.009404F, 0.0018009F, -0.0092801F, 
                    -0.016675F, -0.013973F, -0.00018887F, 0.017873F, 0.028294F, 0.020954F, -0.0048033F, -0.036754F, -0.053709F, -0.035879F, 
                    0.023444F, 0.11149F, 0.19934F, 0.25408F, 0.25408F, 0.19934F, 0.11149F, 0.023444F, -0.035879F, -0.053709F, 
                    -0.036754F, -0.0048033F, 0.020954F, 0.028294F, 0.017873F, -0.00018887F, -0.013973F, -0.016675F, -0.0092801F, 0.0018009F, 
                    0.009404F, 0.010045F, 0.0045784F, -0.0024454F, -0.0078587F, -0.0080908F, -0.0072497F, -0.0024615F
                };
                OOO000O[16 + 6 * l1 + j1] = 0.0F;
                if(O0OOO)
                {
                    for(l = 0; l < 8; l++)
                        OOO000O[16 + 6 * l1 + j1] += OOO0000[l1 + 7 + l] * af[(6 * l + 5) - j1];

                } else
                {
                    for(int j = 0; j < 8; j++)
                        OOO000O[16 + 6 * l1 + j1] += OOO0000[l1 + 7 + j] * l[(6 * j + 5) - j1];

                }
                OOO000O[16 + 6 * l1 + j1] *= 6F;
            }

        }

        int k1 = i * 6;
        int i1 = 0;
        do
        {
            if(OOO00 >= (float)k1)
                break;
            int k = (int)OOO00 + 16;
            i = OOO00 - (float)(k - 16);
            i = (1.0F - i) * OOO000O[k - 1] + i * OOO000O[k];
            if(2 * i1 > 3100)
                break;
            OOO00O0[2 * i1] = (byte)((int)i & 0xff);
            OOO00O0[2 * i1 + 1] = (byte)((int)i >> 8);
            OOO00 += OO0OO * (double)O00OO;
            i1++;
        } while(true);
        OOO00 -= k1;
        if(O0O00 == 0)
        {
            O.write(OOO00O0, 0, i1 * 2);
            O0O0O += i1;
        } else
        if(i1 < O0O00)
        {
            O0O00 -= i1;
        } else
        {
            O.write(OOO00O0, O0O00 * 2, (i1 - O0O00) * 2);
            O0O00 = 0;
            O0O0O += i1 - O0O00;
        }
        if(OOOO00O == 0L)
            OOOO000 = OOOO00O;
        OOOO00O += i1;
        OOO0OOO[0] = OOO0OOO[1];
        OOO0OOO[1] = OOO0OOO[2];
        OOO0OOO[2] = OOO0OOO[3];
        OOO0OOO[3] = (float)OOOO00O / 48F - (float)(System.currentTimeMillis() - O0OO0);
        if(O0O00 == 0 && OOO0OOO[3] < OOO0OO0 && OOOO000 > OOO0OO0 + 150F)
        {
            O0O00 = (int)(OOO0OO0 - OOO0OOO[3]);
            O0OO++;
            OOOO000 -= O0O00;
            OOO0OOO[0] -= O0O00;
            OOO0OOO[1] -= O0O00;
            OOO0OOO[2] -= O0O00;
            OOO0OOO[3] -= O0O00;
            OOO0OO0 -= O0O00;
            O0O00 *= 48;
            OOOO00O -= O0O00;
        }
        if(OOO0OOO[1] > OOO0OOO[0] && OOO0OOO[1] > OOO0OOO[2] && OOO0OOO[1] > OOO0OOO[3])
            OOOO000 = OOO0OOO[1];
        for(i = 0; i < 16; i++)
        {
            OOO000O[i] = OOO000O[k1 + i];
            OOO0000[i] = OOO0000[k1 / 6 + i];
        }

        i = OOOO000 - OOO0OO0;
        O00O = (int)i;
        i -= 200F;
        i /= 3F;
        OO000 = 0.999F * OO000 + 0.001F * i;
        if(OO000 < -40F)
            OO000 = -40F;
        if(OO000 > 40F)
            OO000 = 40F;
        OO0OO = 1.0F + OO000 * 5E-05F;
        if(i > 200F)
        {
            O0O00 = (int)i;
            O0OO++;
            OOOO000 -= O0O00;
            OOO0OOO[0] -= O0O00;
            OOO0OOO[1] -= O0O00;
            OOO0OOO[2] -= O0O00;
            OOO0OOO[3] -= O0O00;
            O0O00 *= 48;
            OOOO00O -= O0O00;
        }
    }

    void O(float f, int i)
    {
        for(int j = 19; j > 0; j--)
            OOO0O00[j] = OOO0O00[j - 1];

        OOO0O00[0] = f;
        float f1 = OOO0O00[10];
        if(O000)
            f1 = 0.0F;
        else
        if(OOOOOO >= 0)
        {
            f1 = 0.0F;
            float af[][] = {
                {
                    0.0416798F, -0.0010372F, -0.0316519F, 0.0592284F, -0.0496101F, -0.0066906F, 0.0774353F, -0.0963F, -0.0179755F, 0.5594503F
                }, {
                    0.030725F, 0.062421F, -0.028814F, -0.027426F, -0.056624F, -0.034655F, 0.021408F, 0.110595F, 0.199341F, 0.255473F
                }
            };
            for(f = 0; f < 10; f++)
                f1 += af[OOOOOO][f] * (OOO0O00[f] + OOO0O00[19 - f]);

        }
        OOO0000[i + 16] = f1 * OOOO0;
        if(i == 127)
            OO(128);
    }

    public void run()
    {
        byte abyte0[] = new byte[264];
        int ai3[] = new int[20];
        int ai2[] = new int[20];
        int ai1[] = new int[20];
        int j5 = 0;
        int i5 = 0;
        byte byte1 = -1;
        int l4 = 0;
        int k4 = 0;
        int j4 = 256;
        int i4 = 0;
        O0O0 = -1;
        int l3;
        try
        {
            do
            {
                if(Thread.currentThread() != OO00)
                    break;
                O0O++;
                O();
                l3 = 0;
                int k3 = 0;
                do
                {
                    if(l4 >= 128)
                        break;
                    l3 = O0.read(abyte0, j5, 260 - j5);
                    if(l3 < 0)
                        break;
                    j5 += l3;
                    int j3;
                    for(boolean flag = true; flag && j5 > 0; j5 -= j3)
                    {
                        j3 = 0;
                        if(byte1 == -1)
                        {
                            if(j5 < 2)
                            {
                                flag = false;
                            } else
                            {
                                byte1 = 0;
                                int i = (abyte0[0] & 0xff) + ((abyte0[1] & 0xff) << 8);
                                O(i);
                                j3 = 2;
                            }
                        } else
                        if(byte1 == 0)
                        {
                            if((abyte0[0] & 0x80) != 0)
                            {
                                k3 = 1;
                                byte1 = 2;
                                l4 = 0;
                            } else
                            if(abyte0[0] >= 16 && abyte0[0] <= 95)
                            {
                                k3 = 4;
                                byte1 = 2;
                                l4 = 0;
                                i4 = 6 - (abyte0[0] >> 4);
                            } else
                            if(abyte0[0] == 0)
                            {
                                byte1 = 1;
                                j3 = 1;
                            } else
                            if((abyte0[0] & 0xf0) == 112)
                            {
                                if(j5 < 2)
                                {
                                    flag = false;
                                } else
                                {
                                    smeter = 10 * (((abyte0[0] & 0xf) << 8) + (abyte0[1] & 0xff));
                                    j3 = 2;
                                }
                            } else
                            if(abyte0[0] == 1)
                            {
                                if(j5 < 3)
                                {
                                    flag = false;
                                } else
                                {
                                    int j = (abyte0[1] << 8) + (abyte0[2] & 0xff);
                                    O00OO = (float)j / 8000F;
                                    j3 = 3;
                                }
                            } else
                            if(abyte0[0] == 2)
                            {
                                if(j5 < 3)
                                {
                                    flag = false;
                                } else
                                {
                                    int k = (abyte0[1] << 8) + (abyte0[2] & 0xff);
                                    j4 = k;
                                    j3 = 3;
                                }
                            } else
                            if(abyte0[0] == 3)
                            {
                                if(j5 < 2)
                                {
                                    flag = false;
                                } else
                                {
                                    O0OOOO = abyte0[1];
                                    OOOOOO = (abyte0[1] & 0xf) - 1;
                                    if(OOOOOO == 2)
                                    {
                                        OOOOOO = 0;
                                        O0OOO = true;
                                    } else
                                    {
                                        O0OOO = false;
                                    }
                                    j3 = 2;
                                }
                            } else
                            if(abyte0[0] == 4)
                            {
                                j3 = 1;
                                l4 = 128;
                                for(int l = 0; l < 128; l++)
                                    OOO0000[l + 16] = 0.0F;

                                OO(128);
                                for(l3 = 0; l3 < 20; l3++)
                                    ai3[l3] = ai2[l3] = 0;

                                k4 = 0;
                            } else
                            {
                                j3 = 1;
                                OO0O0 = true;
                                flag = false;
                            }
                        } else
                        if(byte1 == 1)
                            if(j5 < 128 || l4 == 128)
                            {
                                flag = false;
                            } else
                            {
                                for(int i1 = 0; i1 < 20; i1++)
                                    ai3[i1] = ai2[i1] = 0;

                                k4 = 0;
                                for(l3 = 0; l3 < j5 && l4 < 128; l4++)
                                {
                                    OOO0000[l4 + 16] = OOO00OO[(short)abyte0[l3] & 0xff];
                                    O(OOO00OO[(short)abyte0[l3] & 0xff], l4);
                                    l3++;
                                }

                                j3 = 128;
                                byte1 = 0;
                                flag = false;
                            }
                        if(byte1 == 2)
                        {
                            l3 = 0;
                            byte byte0 = ((byte)((O0OOOO & 0x10) != 16 ? 14 : 12));
                            do
                            {
                                if(l3 >= j5 || l4 >= 128)
                                    break;
                                int j1 = (abyte0[l3 + 3] & 0xff) + ((abyte0[l3 + 2] & 0xff) << 8) + ((abyte0[l3 + 1] & 0xff) << 16) + ((abyte0[l3 + 0] & 0xff) << 24);
                                int k1 = j1 << k3;
                                int i3 = k3;
                                int l2 = k1;
                                int k2 = 0;
                                int l1 = 15 - i4;
                                int j2 = j4;
                                int ai[] = {
                                    999, 999, 8, 4, 2, 1, 99, 99
                                };
                                if(k1 != 0)
                                    for(; (k1 & 0x80000000) == 0 && k2 < l1; k2++)
                                        k1 <<= 1;

                                int i2;
                                if(k2 < l1)
                                {
                                    i2 = k2;
                                    k2++;
                                    l1 = k1 << 1;
                                } else
                                {
                                    i2 = k1 >> 24 & 0xff;
                                    k2 += 8;
                                    l1 = k1 << 8;
                                }
                                k1 = 0;
                                if(i2 >= ai[i4])
                                    k1++;
                                if(i2 >= ai[i4 - 1])
                                    k1++;
                                if(k1 > i4 - 1)
                                    k1 = i4 - 1;
                                ai = (l1 >> 16 & 0xffff) >> 17 - i4 & -1 << k1;
                                ai += i2 << i4 - 1;
                                if((l1 & 1 << (32 - i4) + k1) != 0)
                                {
                                    ai |= (1 << k1) - 1;
                                    ai = ~ai;
                                }
                                for(k3 += (k2 + i4) - k1; k3 >= 8; k3 -= 8)
                                    l3++;

                                if(l2 == 0 || l3 + (7 + k3) / 8 > j5)
                                {
                                    flag = false;
                                    k3 = i3;
                                    break;
                                }
                                j3 = l3;
                                l1 = 0;
                                for(k1 = 0; k1 < 20; k1++)
                                    l1 += ai3[k1] * ai2[k1];

                                k1 = l1 / 4096;
                                i2 = ai * j2 + j2 / 2;
                                l1 = i2 >> 4;
                                for(ai = 0; ai < 20; ai++)
                                    ai3[ai] += -(ai3[ai] >> 7) + (ai2[ai] * l1 >> byte0);

                                for(ai = 19; ai > 0; ai--)
                                {
                                    ai2[ai] = ai2[ai - 1];
                                    ai1[ai] = ai1[ai - 1];
                                }

                                ai2[0] = k1 + i2;
                                ai = ai2[0] + (k4 >> 4);
                                if((O0OOOO & 0x10) == 16)
                                    k4 = 0;
                                else
                                    k4 += (ai2[0] << 4) >> 3;
                                O(ai, l4);
                                l4++;
                            } while(true);
                            if(l4 == 128)
                            {
                                byte1 = 0;
                                if(k3 > 0)
                                {
                                    j3++;
                                    k3 = 0;
                                }
                            }
                            i5++;
                        }
                        if(j3 <= 0)
                            continue;
                        for(l3 = j3; l3 < j5; l3++)
                            abyte0[l3 - j3] = abyte0[l3];

                    }

                } while(!OO0O0 && j5 >= 0);
                if(l4 == 128)
                    l4 = 0;
                OO0 = l3;
                O0O++;
            } while(!OO0O0 && l3 != -1);
        }
        catch(IOException ioexception)
        {
            OOO0 = "!" + ioexception.getMessage();
        }
        OOO0 = "^" + OOO0;
        O.flush();
        O.stop();
        O.close();
        try
        {
            OO.close();
        }
        catch(Exception _ex) { }
        O0O = -5;
        O();
    }

    public void update(LineEvent lineevent)
    {
    }

    public static void O(String as[])
    {
        System.out.println("Copyright 2007-2013, Pieter-Tjerk de Boer, PA3FWM, pa3fwm@websdr.org - All rights reserved.");
        System.out.println("Since the intended use of this (or any) applet involves sending a copy to the client computer, I (PA3FWM) hereby allow making it available unmodified, as part of the original .jar file, via my original WebSDR server software, to original WebSDR clients.");
        System.out.println("I do not permit reverse engineering of this applet; please contact me for the motivation for that.");
    }

    private SourceDataLine O;
    private Socket OO;
    private InputStream O0;
    OutputStream OOO;
    static final long serialVersionUID = 1L;
    int O0O;
    int OO0;
    int O00;
    int OOOO;
    int O0OO;
    final float OO0O = 200F;
    int O00O;
    String OOO0;
    int O0O0;
    Thread OO00;
    boolean O000;
    boolean OOOOO;
    boolean O0OOO;
    public int smeter;
    double OO0OO;
    float O00OO;
    double OOO0O;
    double O0O0O;
    final int OO00O = 23;
    final int O000O = 48;
    float OOOO0;
    final float OOO0O0O[] = new float[3];
    float OOO0OO0;
    long O0OO0;
    long OOOO00O;
    float OOOO000;
    final float OOO0OOO[] = new float[4];
    final short OOO00OO[] = {
        -5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736, -7552, -7296, 
        -8064, -7808, -6528, -6272, -7040, -6784, -2752, -2624, -3008, -2880, 
        -2240, -2112, -2496, -2368, -3776, -3648, -4032, -3904, -3264, -3136, 
        -3520, -3392, -22016, -20992, -24064, -23040, -17920, -16896, -19968, -18944, 
        -30208, -29184, -32256, -31232, -26112, -25088, -28160, -27136, -11008, -10496, 
        -12032, -11520, -8960, -8448, -9984, -9472, -15104, -14592, -16128, -15616, 
        -13056, -12544, -14080, -13568, -344, -328, -376, -360, -280, -264, 
        -312, -296, -472, -456, -504, -488, -408, -392, -440, -424, 
        -88, -72, -120, -104, -24, -8, -56, -40, -216, -200, 
        -248, -232, -152, -136, -184, -168, -1376, -1312, -1504, -1440, 
        -1120, -1056, -1248, -1184, -1888, -1824, -2016, -1952, -1632, -1568, 
        -1760, -1696, -688, -656, -752, -720, -560, -528, -624, -592, 
        -944, -912, -1008, -976, -816, -784, -880, -848, 5504, 5248, 
        6016, 5760, 4480, 4224, 4992, 4736, 7552, 7296, 8064, 7808, 
        6528, 6272, 7040, 6784, 2752, 2624, 3008, 2880, 2240, 2112, 
        2496, 2368, 3776, 3648, 4032, 3904, 3264, 3136, 3520, 3392, 
        22016, 20992, 24064, 23040, 17920, 16896, 19968, 18944, 30208, 29184, 
        32256, 31232, 26112, 25088, 28160, 27136, 11008, 10496, 12032, 11520, 
        8960, 8448, 9984, 9472, 15104, 14592, 16128, 15616, 13056, 12544, 
        14080, 13568, 344, 328, 376, 360, 280, 264, 312, 296, 
        472, 456, 504, 488, 408, 392, 440, 424, 88, 72, 
        120, 104, 24, 8, 56, 40, 216, 200, 248, 232, 
        152, 136, 184, 168, 1376, 1312, 1504, 1440, 1120, 1056, 
        1248, 1184, 1888, 1824, 2016, 1952, 1632, 1568, 1760, 1696, 
        688, 656, 752, 720, 560, 528, 624, 592, 944, 912, 
        1008, 976, 816, 784, 880, 848
    };
    boolean OO0O0;
    int O00O0;
    float OOO00;
    int O0O00;
    float OO000;
    float OOO0000[];
    float OOO000O[];
    byte OOO00O0[];
    int O0000;
    float OOO0O00[];
    int OOOOOO;
    int O0OOOO;
}