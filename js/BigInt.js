var BigInt = (function(){
	var MAX_DIGIT = 7, MAX_POW = Math.pow(10,MAX_DIGIT);
	var BigInt = function(o){
		this.__sign = false; this.__numberData = [];
		
		var copyArr = function(a){
			for(var b=[],i=a.length;i--;b[i]=a[i]);
			return b;
		}
		this.dumpData = function(){
			return [this.__sign,copyArr(this.__numberData)];
		}
		this.clone = function(){return new BigInt([this.__sign,copyArr(this.__numberData)])}
		this.toString = function(){
			var s=this.dumpData()[1].reverse().map(function(a){a=''+a;while(a.length<MAX_DIGIT)a='0'+a;return a}).join('').replace(/^(0+)/,'');
			return (this.__sign?'-':'')+(s.length?s:'0');
		}
		this.equals = function(b){
			if((typeof b)=='number'){
				if(b==0) return this.__numberData.length==1&&this.__numberData[0]==0;
				if(b<0&&!this.__sign) return false;
				if(Math.abs(b)<MAX_POW) return this.__numberData.length==1&&this.__numberData[0]==Math.abs(b);
				return this.equals(new BigInt(b));
			}
			if(this.__sign!=b.__sign||this.__numberData.length!=b.__numberData.length) return false;
			for(var i=0;i<this.__numberData.length;i++) if(this.__numberData[i]!=b.__numberData[i]) return false;
			return true;
		}
		var isFirstBigger = function(x,y){
			if(x.length>y.length) return true;
			if(x.length<y.length) return false;
			for(var i=x.length;i--;)
				if(x[i]>y[i]) return true;
				else if(x[i]<y[i]) return false;
			return false; //can never be happen.
		}
		this.isBiggerThan = function(b){
			if(this.equals(b)) return false;
			if(this.__sign!=b.__sign) return b.__sign;
			return isFirstBigger(this.__numberData,b.__numberData)!=this.__sign;
		}
		this.getSign = function(){
			return this.__sign;
		}
		this.setSign = function(s){
			this.__sign = !!s;
		}
		this.negate = function(){
			this.__sign = !this.__sign;
		}
		this.addSing = function(i,n){
			if(n==0) return 0;
			if(!this.__numberData[i]) this.__numberData[i] = 0;
			this.__numberData[i] += n;
			if(this.__numberData[i]>=MAX_POW){
				this.__numberData[i]-=MAX_POW;
				return 1;
			}
			return 0;
		}
		var addArr = function(x,y){
			if(x.length<y.length) return addArr(y,x);
			var i,z=[],c=0;
			for(i=0;i<y.length;i++){
				z[i]=x[i]+y[i]+c;
				if(z[i]>=MAX_POW) z[i]-=MAX_POW,c=1;
				else c=0;
			}
			for(;i<x.length;i++){
				z[i]=x[i]+c;
				if(z[i]>=MAX_POW) z[i]-=MAX_POW,c=1;
				else c=0;
			}
			if(c) z[i]=1;
			return z;
		}
		this.add = function(b){
			if(b.equals(0)) return this.clone();
			var ts=this.__sign;
			if(this.__sign!=b.__sign){
				this.__sign=false;
				b.__sign = false;
				var rs=this.minus(b);
				if(this.__sign=ts) rs.__sign = !rs.__sign;
				b.__sign = !ts;
				return rs;
			}
			return new BigInt([ts,addArr(this.__numberData,b.__numberData)]);
		}
		var minusArr = function(x,y){
			var i,z=[],c=0;
			for(i=0;i<y.length;i++){
				z[i] = x[i]-y[i]-c;
				if(z[i]<0){
					z[i]+=MAX_POW;
					c=1;
				}else c=0;
			}
			for(;i<x.length;i++){
				z[i] = x[i]-c;
				if(z[i]<0){
					z[i]+=MAX_POW;
					c=1;
				}else c=0;
			}
			while(z[z.length-1]==0) z.pop();
			return z;
		}
		this.subtract = function(b){
			if(b.equals(0)) return this.clone();
			var ts=this.__sign;
			if(this.__sign!=b.__sign){
				this.__sign = b.__sign = false;
				var bc = this.add(b);
				b.__sign = !(this.__sign=ts);
				if(ts) bc.__sign = !bc.__sign;
				return bc;
			}
			this.__sign = b.__sign = false;
			var x,y,c=0,d=true,i;
			if(this.isBiggerThan(b)) x=this.__numberData, y=b.__numberData, d=false;
			else x=b.__numberData, y=this.__numberData;
			this.__sign = b.__sign = ts;
			return new BigInt([ts!=d,minusArr(x,y)]);
		}
		var multiplyKaratsuba = function(x,y){
			if(x.length<y.length) return multiplyKaratsuba(y,x);
			if(x.length==1){
				var z=x[0]*y[0];
				if(z<MAX_POW) return [z];
				return [z%MAX_POW,~~(z/MAX_POW)];
			}
			if(y.length==1){
				if(y[0]==0) return [0];
				for(var i=0,c=0,yd=y[0],z=[];i<x.length;i++){
					z[i]=x[i]*yd+c;
					c=~~(z[i]/MAX_POW);
					z[i]%=MAX_POW;
				}
				if(c) z[i]=c;
				return z;
			}else{
				var yl2=~~(y.length/2);
				var x2=x.slice(0,yl2),y2=y.slice(0,yl2),x1=x.slice(yl2),y1=y.slice(yl2);
				var A=multiplyKaratsuba(x1,y1),B=multiplyKaratsuba(x2,y2),C=multiplyKaratsuba(addArr(x1,x2),addArr(y1,y2));
				var K=minusArr(minusArr(C,A),B),i;
				for(i=yl2;i--;){
					A.unshift(0,0);
					K.unshift(0);
				}
				return addArr(A,addArr(K,B));
			}
		}
		this.multiply = function(b){
			return new BigInt([this.__sign!=b.__sign, multiplyKaratsuba(this.__numberData,b.__numberData)]);
		}
		//Should re-implement this. (too slow)
		var divArr = function(x,y){
			var i,z,c,a;
			if(isFirstBigger(y,x)) return false;
			if(x.length==1) return [~~(x[0]/y[0])];
			if(y.length==1){
				var j=y[0];
				if(j==0) throw new Error('Division by zero!');
				if(j==1){
					for(i=x.length,z=[];i--;z[i]=x[i]); return z;
				}
				for(c=0,i=x.length,z=[];i--;){
					z[i]=x[i]+c;
					if(z[i]%j) c=MAX_POW*(z[i]%j);
					z[i]=~~(z[i]/j);
				}
				if(z[z.length-1]==0) z.pop();
				return z;
			}
			z=copyArr(y); a=[1];
			while(isFirstBigger(x,z)){
				z.unshift(0);
				a.unshift(0);
			}
			z.shift(); a.shift();
			for(i=x.length==z.length?~~((x[x.length-1]-1)/(z[z.length-1]+1)):~~((x[x.length-1]*MAX_POW+x[x.length-2]-1)/(z[z.length-1]+1));i<MAX_POW;i++)
				if(!isFirstBigger(x,multiplyKaratsuba(z,[i]))) break;
			i--;
			return addArr(multiplyKaratsuba(a,[i]),divArr(minusArr(x,multiplyKaratsuba(z,[i])),y));
		}
		this.divide = function(b){
			return new BigInt([this.__sign!=b.__sign, divArr(this.__numberData,b.__numberData)]);
		}
		//Should re-implement this. (too slow)
		var modArr = function(x,y){
			if(y.length==1){
				var y0=y[0];
				if(y0==2||y0==4||y0==5||y0==8||y0==10||y0==16||y0==20||y0==25||y0==32||y0==40
				||y0==64||y0==100||y0==128||y0==256||y0==512||y0==1000||y0==1024||y0==10000||y0==100000) return [x[0]%y0];
			}
			return minusArr(x,multiplyKaratsuba(y,divArr(x,y)));
		}
		this.mod = function(b){
			if(b.__sign) throw new Error('b is negative in BigInt.mod(BigInt b)');
			if(this.__sign){
				this.__sign = false;
				var result = b.minus(this.mod(b));
				this.__sign = true;
				if(result.equals(b)) return new BigInt(0);
				return result;
			}
			return new BigInt([false,modArr(this.__numberData,b.__numberData)]);
		}
		var i;
		if(o==null) o=0;
		switch(typeof o){
			case 'object':
				try{
					this.__sign=!!o[0];
					if(o[1].length==1&&o[1][0]==0) this.__sign=false;
					for(i=0;i<o[1].length;i++)
						this.__numberData.push(o[1][i]);
				}catch(e){this.__sign=false;this.__numberData=[0];}
				break;
			case 'number':
				if(-MAX_POW<o&&o<MAX_POW){
					if(o<0){
						o=-o; this.__sign=true;
					}
					this.__numberData = [~~o];
				}else if(-Number.MAX_VALUE<o&&o<Number.MAX_VALUE){
					if(o<0){
						o=-o; this.__sign=true;
					}
					o=Math.floor(o);
					while(o>0){
						this.__numberData.push(o%MAX_POW);
						o=Math.floor(o/MAX_POW);
					}
				}
				break;
			case 'string':
				if(!o.match(/^\-?[0-9]+$/)) break;
				if(o[0]=='-'){
					this.__sign=true;
					o=o.slice(1);
				}
				while(o.length){
					this.__numberData.push(parseInt(o.slice(-MAX_DIGIT),10));
					o=o.slice(0,-MAX_DIGIT);
				}
				break;
		}
	}
	return BigInt;
}());

(function(BigInt){
	BigInt.ZERO = new BigInt(0);
	BigInt.ONE = new BigInt(1);
	BigInt.TWO = new BigInt(2);
	BigInt.THREE = new BigInt(3);
	BigInt.THEANSWER = new BigInt(42);
	BigInt.PRIMES = [
		new BigInt(3),
		new BigInt(7),
		new BigInt(13),
		new BigInt(47),
		new BigInt(73),
		new BigInt(101),
		new BigInt(883),
		new BigInt(2531),
		new BigInt(4481),
		new BigInt(32299),
		new BigInt(130051),
		new BigInt(233267),
		new BigInt(3640909),
		new BigInt(19676717),
		new BigInt(83205011),
		new BigInt(222474463),
		new BigInt('250146970973'),
		new BigInt('2546463813923'),
		new BigInt('6839269182703'),
		new BigInt('10286428730153'),
		new BigInt('132694149007439'),
		new BigInt('413769901072380953'),
		new BigInt('709364612625632432650913'),
		new BigInt('4565942450634530082860177'),
		new BigInt('51951800629850088190383311'),
		new BigInt('472513090645872515149465052411'),
		new BigInt('76285487235109713965939330115191639'),
		new BigInt('6693102488725841461817035690659984518257'),
		new BigInt('59210937384584975864213427526019484565316659'),
		new BigInt('3299672634956653631085567674762073402306723493'),
		new BigInt('567198778129097365266570118936499234397395084783'),
		new BigInt('651271417557711039459424454473029499910068546379'),
		new BigInt('742728711398362170741499690272074900169329336219')
	];
	BigInt.PRIMES.random = function(){return BigInt.PRIMES[~~(Math.random()*BigInt.PRIMES.length)]};
}(BigInt));

if(exports) exports.BigInt = BigInt;
