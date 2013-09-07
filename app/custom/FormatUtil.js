Ext.define('Haamro.custom.FormatUtil', {

    singleton: true,

	alternateClassName: 'FormatUtil',

    requires: [
        'Ext.Number',
    ],

    formatNepCurrency: function(v, rs) {
        v += '';
        x = v.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        var z = 0;
        var len = String(x1).length;
        var num = parseInt((len / 2) - 1);

        while (rgx.test(x1)) {
            if (z > 0) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            } else {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                rgx = /(\d+)(\d{2})/;
            }
            z++;
            num--;
            if (num == 0) {
                break;
            }
        }
        if (rs) {
             return 'Rs. ' + x1 + x2;
        } else {
            return x1 + x2;
        }
    },

    formatUSCurrency : function(v, formatString) {
        if (!formatString) {
            return v;
        }
        v = Ext.Number.from(v, NaN);
        if (isNaN(v)) {
            return '';
        }
        var comma = ',',
            dec   = '.',
            i18n  = false,
            neg   = v < 0,
            formatCleanRe  = /[^\d\.]/g,
            hasComma,
            psplit,
            fnum,
            cnum,
            parr,
            j,
            m,
            n,
            i;

        v = Math.abs(v);

        // The "/i" suffix allows caller to use a locale-specific formatting string.
        // Clean the format string by removing all but numerals and the decimal separator.
        // Then split the format string into pre and post decimal segments according to *what* the
        // decimal separator is. If they are specifying "/i", they are using the local convention in the format string.
        if (formatString.substr(formatString.length - 2) == '/i') {
            console.log("I18N Hit");
            I18NFormatCleanRe = new RegExp('[^\\d\\' + dec + ']','g');
            formatString = formatString.substr(0, formatString.length - 2);
            i18n   = true;
            hasComma = formatString.indexOf(comma) != -1;
            psplit = formatString.replace(I18NFormatCleanRe, '').split(dec);
        } else {
            hasComma = formatString.indexOf(',') != -1;
            psplit = formatString.replace(formatCleanRe, '').split('.');
        }

        if (psplit.length > 2) {
            //<debug>
            Ext.Error.raise({
                sourceClass: "Ext.util.Format",
                sourceMethod: "number",
                value: v,
                formatString: formatString,
                msg: "Invalid number format, should have no more than 1 decimal"
            });
            //</debug>
        } else if (psplit.length > 1) {
            v = Ext.Number.toFixed(v, psplit[1].length);
        } else {
            v = Ext.Number.toFixed(v, 0);
        }

        fnum = v.toString();

        psplit = fnum.split('.');

        if (hasComma) {
            cnum = psplit[0];
            parr = [];
            j = cnum.length;
            m = Math.floor(j / 3);
            n = cnum.length % 3 || 3;

            for (i = 0; i < j; i += n) {
                if (i !== 0) {
                    n = 3;
                }

                parr[parr.length] = cnum.substr(i, n);
                m -= 1;
            }
            fnum = parr.join(comma);
            if (psplit[1]) {
                fnum += dec + psplit[1];
            }
        } else {
            if (psplit[1]) {
                fnum = psplit[0] + dec + psplit[1];
            }
        }

        if (neg) {
            /*
             * Edge case. If we have a very small negative number it will get rounded to 0,
             * however the initial check at the top will still report as negative. Replace
             * everything but 1-9 and check if the string is empty to determine a 0 value.
             */
            neg = fnum.replace(/[^1-9]/g, '') !== '';
        }

        return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
    },
});