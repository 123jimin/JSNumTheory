(function(){
	var MAX_DIGIT = 7, MAX_POW = Math.pow(10,MAX_DIGIT);
	window.BigInt = function(o){
		this.__sign = false; this.__numberData = [];
	
		this.dumpData = function(){
			var a=[],i;
			for(i=0;i<this.__numberData.length;i++) a[i]=this.__numberData[i];
			return [this.__sign,a];
		}
		this.clone = function(){return new BigInt(this.dumpData())}
		this.toString = function(){
			var s=this.dumpData()[1].reverse().map(function(a){a=''+a;while(a.length<MAX_DIGIT)a='0'+a;return a}).join('').replace(/^(0+)/,'');
			return (this.__sign?'-':'')+(s.length?s:'0');
		}
		this.equals = function(b){
			if(this.__sign!=b.__sign||this.__numberData.length!=b.__numberData.length) return false;
			for(var i=0;i<this.__numberData.length;i++) if(this.__numberData[i]!=b.__numberData[i]) return false;
			return true;
		}
		this.isBiggerThan = function(b){
			if(this.equals(b)) return false;
			if(this.__sign==false&&b.__sign==true) return true;
			if(this.__sign==true&&b.__sign==false) return false;
			if(this.__numberData.length>b.__numberData.length) return !this.__sign;
			if(this.__numberData.length<b.__numberData.length) return this.__sign;
			for(var i=this.__numberData.length;i--;)
				if(this.__numberData[i]>b.__numberData[i]) return !this.__sign;
				else if(b.__numberData[i]>this.__numberData[i]) return this.__sign;
			return false; //can never be happen.
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
		this.add = function(b){
			var bc=b.clone(), c=0, i;
			if(this.__sign^bc.__sign){
				var ts=this.__sign; __sign=false;
				bc.__sign = false;
				var rs=this.minus(bc);
				if(this.__sign=ts) rs.__sign = !rs.__sign;
				return rs;
			}
			for(i=0;i<this.__numberData.length;i++){
				if(c+this.__numberData[i]){
					if(!bc.__numberData[i]) bc.__numberData[i]=c+this.__numberData[i];
					else bc.__numberData[i]+=c+this.__numberData[i];
					if(bc.__numberData[i]>=MAX_POW) bc.__numberData[i]-=MAX_POW,c=1;
					else c=0;
				}
			}
			for(;c&&i<bc.__numberData[i];i++){
				bc.__numberData[i]++; if(bc.__numberData[i]==MAX_POW) bc.__numberData[i]=0,c=0;
			}
			if(c) bc.__numberData[i]=1;
			return bc;
		}
		this.minus = function(b){
			//incomplete
		}
	
		var i;
		if(o==null) o=0;
		switch(typeof o){
			case 'object':
				try{
					this.__sign=!!o[0];
					for(i=0;i<o[1].length;i++)
						this.__numberData.push(o[1][i]);
				}catch(e){this.__sign=false;this.__numberData=[0];}
				break;
			case 'number':
				if(-MAX_POW<o&&o<MAX_POW){
					if(o<0){
						o=-o; this.__sign=true;
					}
					this.__numberData = [Math.floor(o)];
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
}());
