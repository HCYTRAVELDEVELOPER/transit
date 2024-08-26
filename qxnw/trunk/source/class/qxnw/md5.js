qx.Class.define("qxnw.md5",
        {
            statics:
                    {
                        _ASCII: "01234567890123456789012345678901 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
                        MD5: function(nachricht)
                        {
                            if (typeof nachricht == 'undefined' || nachricht == null || nachricht == "") {
                                return null;
                            }
                            state = new this._array(4);
                            count = new this._array(2);
                            count[0] = 0;
                            count[1] = 0;
                            buffer = new this._array(64);
                            transformBuffer = new this._array(16);
                            digestBits = new this._array(16);

                            S11 = 7;
                            S12 = 12;
                            S13 = 17;
                            S14 = 22;
                            S21 = 5;
                            S22 = 9;
                            S23 = 14;
                            S24 = 20;
                            S31 = 4;
                            S32 = 11;
                            S33 = 16;
                            S34 = 23;
                            S41 = 6;
                            S42 = 10;
                            S43 = 15;
                            S44 = 21;

                            var l, s, k, ka, kb, kc, kd;

                            this._init();
                            for (k = 0; k < nachricht.length; k++)
                            {
                                l = nachricht.charAt(k);
                                this._update(this._ASCII.lastIndexOf(l));
                            }
                            this._finish();
                            ka = kb = kc = kd = 0;
                            for (i = 0; i < 4; i++)
                                ka += this._shl(digestBits[15 - i], (i * 8));
                            for (i = 4; i < 8; i++)
                                kb += this._shl(digestBits[15 - i], ((i - 4) * 8));
                            for (i = 8; i < 12; i++)
                                kc += this._shl(digestBits[15 - i], ((i - 8) * 8));
                            for (i = 12; i < 16; i++)
                                kd += this._shl(digestBits[15 - i], ((i - 12) * 8));
                            s = this._hexa(kd) + this._hexa(kc) + this._hexa(kb) + this._hexa(ka);
                            return s;
                        },
                        _array: function(n)
                        {
                            for (i = 0; i < n; i++)
                            {
                                this[i] = 0;
                            }
                            this._length = n;
                       },
                        _integer: function(n)
                        {
                            return n % (0xffffffff + 1);
                        },
                        _shr: function(a, b)
                        {
                            a = this._integer(a);
                            b = this._integer(b);
                            if (a - 0x80000000 >= 0)
                            {
                                a = a % 0x80000000;
                                a >>= b;
                                a += 0x40000000 >> (b - 1);
                            }
                            else
                            {
                                a >>= b;
                            }
                            return a;
                        },
                        _shl1: function(a) {
                            a = a % 0x80000000;
                            if (a & 0x40000000 == 0x40000000)
                            {
                                a -= 0x40000000;
                                a *= 2;
                                a += 0x80000000;
                            }
                            else
                            {
                                a *= 2;
                            }
                            return a;
                        },
                        _shl: function(a, b) {
                            a = this._integer(a);
                            b = this._integer(b);
                            for (var i = 0; i < b; i++)
                                a = this._shl1(a);
                            return a;
                        },
                        _and: function(a, b) {
                            a = this._integer(a);
                            b = this._integer(b);
                            var t1 = (a - 0x80000000);
                            var t2 = (b - 0x80000000);
                            if (t1 >= 0)
                                if (t2 >= 0)
                                    return ((t1 & t2) + 0x80000000);
                                else
                                    return (t1 & b);
                            else
                            if (t2 >= 0)
                                return (a & t2);
                            else
                                return (a & b);
                       },
                        _or: function(a, b) {
                            a = this._integer(a);
                            b = this._integer(b);
                            var t1 = (a - 0x80000000);
                            var t2 = (b - 0x80000000);
                            if (t1 >= 0)
                                if (t2 >= 0)
                                    return ((t1 | t2) + 0x80000000);
                                else
                                    return ((t1 | b) + 0x80000000);
                            else
                            if (t2 >= 0)
                                return ((a | t2) + 0x80000000);
                            else
                                return (a | b);
                       },
                        _xor: function(a, b) {
                            a = this._integer(a);
                            b = this._integer(b);
                            var t1 = (a - 0x80000000);
                            var t2 = (b - 0x80000000);
                            if (t1 >= 0)
                                if (t2 >= 0)
                                    return (t1 ^ t2);
                                else
                                    return ((t1 ^ b) + 0x80000000);
                            else
                            if (t2 >= 0)
                                return ((a ^ t2) + 0x80000000);
                            else
                                return (a ^ b);
                       },
                        _not: function(a) {
                            a = this._integer(a);
                            return (0xffffffff - a);
                       },
                        _F: function(x, y, z)
                        {
                            return this._or(this._and(x, y), this._and(this._not(x), z));
                       },
                        _G: function(x, y, z)
                        {
                            return this._or(this._and(x, z), this._and(y, this._not(z)));
                       },
                        _H: function(x, y, z)
                        {
                            return this._xor(this._xor(x, y), z);
                       },
                        _I: function(x, y, z)
                        {
                            return this._xor(y, this._or(x, this._not(z)));
                       },
                        _rotateLeft: function(a, n)
                        {
                            return this._or(this._shl(a, n), (this._shr(a, (32 - n))));
                       },
                        _FF: function(a, b, c, d, x, s, ac)
                        {
                            a = a + this._F(b, c, d) + x + ac;
                            a = this._rotateLeft(a, s);
                            a = a + b;
                            return a;
                       },
                        _GG: function(a, b, c, d, x, s, ac)
                        {
                            a = a + this._G(b, c, d) + x + ac;
                            a = this._rotateLeft(a, s);
                            a = a + b;
                            return a;
                       },
                        _HH: function(a, b, c, d, x, s, ac)
                        {
                            a = a + this._H(b, c, d) + x + ac;
                            a = this._rotateLeft(a, s);
                            a = a + b;
                            return a;
                       },
                        _II: function(a, b, c, d, x, s, ac)
                        {
                            a = a + this._I(b, c, d) + x + ac;
                            a = this._rotateLeft(a, s);
                            a = a + b;
                            return a;
                       },
                        _transform: function(buf, offset)
                        {
                            var a = 0, b = 0, c = 0, d = 0;
                            var x = transformBuffer;

                            a = state[0];
                            b = state[1];
                            c = state[2];
                            d = state[3];

                            for (i = 0; i < 16; i++) {
                                x[i] = this._and(buf[i * 4 + offset], 0xff);
                                for (j = 1; j < 4; j++) {
                                    x[i] += this._shl(this._and(buf[i * 4 + j + offset], 0xff), j * 8);
                                }
                            }

                            /* Runde 1 */
                            a = this._FF(a, b, c, d, x[ 0], S11, 0xd76aa478); /* 1 */
                            d = this._FF(d, a, b, c, x[ 1], S12, 0xe8c7b756); /* 2 */
                            c = this._FF(c, d, a, b, x[ 2], S13, 0x242070db); /* 3 */
                            b = this._FF(b, c, d, a, x[ 3], S14, 0xc1bdceee); /* 4 */
                            a = this._FF(a, b, c, d, x[ 4], S11, 0xf57c0faf); /* 5 */
                            d = this._FF(d, a, b, c, x[ 5], S12, 0x4787c62a); /* 6 */
                            c = this._FF(c, d, a, b, x[ 6], S13, 0xa8304613); /* 7 */
                            b = this._FF(b, c, d, a, x[ 7], S14, 0xfd469501); /* 8 */
                            a = this._FF(a, b, c, d, x[ 8], S11, 0x698098d8); /* 9 */
                            d = this._FF(d, a, b, c, x[ 9], S12, 0x8b44f7af); /* 10 */
                            c = this._FF(c, d, a, b, x[10], S13, 0xffff5bb1); /* 11 */
                            b = this._FF(b, c, d, a, x[11], S14, 0x895cd7be); /* 12 */
                            a = this._FF(a, b, c, d, x[12], S11, 0x6b901122); /* 13 */
                            d = this._FF(d, a, b, c, x[13], S12, 0xfd987193); /* 14 */
                            c = this._FF(c, d, a, b, x[14], S13, 0xa679438e); /* 15 */
                            b = this._FF(b, c, d, a, x[15], S14, 0x49b40821); /* 16 */

                            /* Runde 2 */
                            a = this._GG(a, b, c, d, x[ 1], S21, 0xf61e2562); /* 17 */
                            d = this._GG(d, a, b, c, x[ 6], S22, 0xc040b340); /* 18 */
                            c = this._GG(c, d, a, b, x[11], S23, 0x265e5a51); /* 19 */
                            b = this._GG(b, c, d, a, x[ 0], S24, 0xe9b6c7aa); /* 20 */
                            a = this._GG(a, b, c, d, x[ 5], S21, 0xd62f105d); /* 21 */
                            d = this._GG(d, a, b, c, x[10], S22, 0x2441453); /* 22 */
                            c = this._GG(c, d, a, b, x[15], S23, 0xd8a1e681); /* 23 */
                            b = this._GG(b, c, d, a, x[ 4], S24, 0xe7d3fbc8); /* 24 */
                            a = this._GG(a, b, c, d, x[ 9], S21, 0x21e1cde6); /* 25 */
                            d = this._GG(d, a, b, c, x[14], S22, 0xc33707d6); /* 26 */
                            c = this._GG(c, d, a, b, x[ 3], S23, 0xf4d50d87); /* 27 */
                            b = this._GG(b, c, d, a, x[ 8], S24, 0x455a14ed); /* 28 */
                            a = this._GG(a, b, c, d, x[13], S21, 0xa9e3e905); /* 29 */
                            d = this._GG(d, a, b, c, x[ 2], S22, 0xfcefa3f8); /* 30 */
                            c = this._GG(c, d, a, b, x[ 7], S23, 0x676f02d9); /* 31 */
                            b = this._GG(b, c, d, a, x[12], S24, 0x8d2a4c8a); /* 32 */

                            /* Runde 3 */
                            a = this._HH(a, b, c, d, x[ 5], S31, 0xfffa3942); /* 33 */
                            d = this._HH(d, a, b, c, x[ 8], S32, 0x8771f681); /* 34 */
                            c = this._HH(c, d, a, b, x[11], S33, 0x6d9d6122); /* 35 */
                            b = this._HH(b, c, d, a, x[14], S34, 0xfde5380c); /* 36 */
                            a = this._HH(a, b, c, d, x[ 1], S31, 0xa4beea44); /* 37 */
                            d = this._HH(d, a, b, c, x[ 4], S32, 0x4bdecfa9); /* 38 */
                            c = this._HH(c, d, a, b, x[ 7], S33, 0xf6bb4b60); /* 39 */
                            b = this._HH(b, c, d, a, x[10], S34, 0xbebfbc70); /* 40 */
                            a = this._HH(a, b, c, d, x[13], S31, 0x289b7ec6); /* 41 */
                            d = this._HH(d, a, b, c, x[ 0], S32, 0xeaa127fa); /* 42 */
                            c = this._HH(c, d, a, b, x[ 3], S33, 0xd4ef3085); /* 43 */
                            b = this._HH(b, c, d, a, x[ 6], S34, 0x4881d05); /* 44 */
                            a = this._HH(a, b, c, d, x[ 9], S31, 0xd9d4d039); /* 45 */
                            d = this._HH(d, a, b, c, x[12], S32, 0xe6db99e5); /* 46 */
                            c = this._HH(c, d, a, b, x[15], S33, 0x1fa27cf8); /* 47 */
                            b = this._HH(b, c, d, a, x[ 2], S34, 0xc4ac5665); /* 48 */

                            /* Runde 4 */
                            a = this._II(a, b, c, d, x[ 0], S41, 0xf4292244); /* 49 */
                            d = this._II(d, a, b, c, x[ 7], S42, 0x432aff97); /* 50 */
                            c = this._II(c, d, a, b, x[14], S43, 0xab9423a7); /* 51 */
                            b = this._II(b, c, d, a, x[ 5], S44, 0xfc93a039); /* 52 */
                            a = this._II(a, b, c, d, x[12], S41, 0x655b59c3); /* 53 */
                            d = this._II(d, a, b, c, x[ 3], S42, 0x8f0ccc92); /* 54 */
                            c = this._II(c, d, a, b, x[10], S43, 0xffeff47d); /* 55 */
                            b = this._II(b, c, d, a, x[ 1], S44, 0x85845dd1); /* 56 */
                            a = this._II(a, b, c, d, x[ 8], S41, 0x6fa87e4f); /* 57 */
                            d = this._II(d, a, b, c, x[15], S42, 0xfe2ce6e0); /* 58 */
                            c = this._II(c, d, a, b, x[ 6], S43, 0xa3014314); /* 59 */
                            b = this._II(b, c, d, a, x[13], S44, 0x4e0811a1); /* 60 */
                            a = this._II(a, b, c, d, x[ 4], S41, 0xf7537e82); /* 61 */
                            d = this._II(d, a, b, c, x[11], S42, 0xbd3af235); /* 62 */
                            c = this._II(c, d, a, b, x[ 2], S43, 0x2ad7d2bb); /* 63 */
                            b = this._II(b, c, d, a, x[ 9], S44, 0xeb86d391); /* 64 */

                            state[0] += a;
                            state[1] += b;
                            state[2] += c;
                            state[3] += d;

                        },
                        _init: function()
                        {
                            count[0] = count[1] = 0;
                            state[0] = 0x67452301;
                            state[1] = 0xefcdab89;
                            state[2] = 0x98badcfe;
                            state[3] = 0x10325476;
                            for (i = 0; i < digestBits.length; i++)
                                digestBits[i] = 0;
                       },
                        _update: function(b)
                        {
                            var index, i;

                            index = this._and(this._shr(count[0], 3), 0x3f);
                            if (count[0] < 0xffffffff - 7)
                                count[0] += 8;
                            else {
                                count[1]++;
                                count[0] -= 0xffffffff + 1;
                                count[0] += 8;
                            }
                            buffer[index] = this._and(b, 0xff);
                            if (index >= 63) {
                                this._transform(buffer, 0);
                            }
                        },
                        _finish: function()
                        {
                            var bits = new this._array(8);
                            var padding;
                            var i = 0, index = 0, padLen = 0;

                            for (i = 0; i < 4; i++) {
                                bits[i] = this._and(this._shr(count[0], (i * 8)), 0xff);
                            }
                            for (i = 0; i < 4; i++) {
                                bits[i + 4] = this._and(this._shr(count[1], (i * 8)), 0xff);
                            }
                            index = this._and(this._shr(count[0], 3), 0x3f);
                            padLen = (index < 56) ? (56 - index) : (120 - index);
                            padding = new this._array(64);
                            padding[0] = 0x80;
                            for (i = 0; i < padLen; i++)
                                this._update(padding[i]);
                            for (i = 0; i < 8; i++)
                                this._update(bits[i]);

                            for (i = 0; i < 4; i++) {
                                for (j = 0; j < 4; j++) {
                                    digestBits[i * 4 + j] = this._and(this._shr(state[i], (j * 8)), 0xff);
                                }
                            }
                        },
                        _hexa: function(n)
                        {
                            var hexa_h = "0123456789abcdef";
                            var hexa_c = "";
                            var hexa_m = n;
                            for (hexa_i = 0; hexa_i < 8; hexa_i++)
                            {
                                hexa_c = hexa_h.charAt(Math.abs(hexa_m) % 16) + hexa_c;
                                hexa_m = Math.floor(hexa_m / 16);
                            }
                            return hexa_c;
                        }
                    }
        }); 