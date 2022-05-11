<template>
<v-app style='background-image: linear-gradient(to bottom right, #009dff, #003dbf);'>
<!--dialogs-->
	<transition name="fade">
		<user 
			:data='user' 
			:params='params'
			v-if='dialogs.user.show'
			@closeDialog='closeDialog($event, "user")'>
		</user>
	</transition>
<!--card-->
	<v-form ref='form' lazy-validation><!--required for this.$refs.form.validate()-->
	<v-card elevation='2' style='width: 450px; text-align: center; margin: 150px auto auto auto;' class='dizagara-outline-blue'>
		<!--logo-->
			<div style='margin: 50px;'>
				<strong style='font-weight: bolder; font-size: 25px; color: gray; text-align: center;'>
					<i class='fa fa-fw fa-bars'></i>FULL-STACK
				</strong>
			</div>
		<!--username textbox-->
			<v-text-field dense outlined
				id='firstFocus'
				append-icon='mdi-account-circle'
				label='Username'
				:rules='[validate.required]'
				placeholder='Type username...'
				v-model='username'
				autocomplete='off'
				background-color='light-blue lighten-5'
				style='margin-left: 30px; margin-right: 30px;'
			></v-text-field>
		<!--password textbox-->
			<v-text-field dense outlined
				append-icon='mdi-lock'
				label='Password'
				:rules='[validate.required]'
				placeholder='Type password...'
				v-model='fruit'
				type='password'
				autocomplete="off"
				background-color='light-blue lighten-5'
				style='margin-left: 30px; margin-right: 30px;'
			></v-text-field>
	<!--action buttons-->
		<v-card-actions style = 'background-color: #2655a9 !important; padding-bottom: 0px;'>
			<v-card-text v-on:keyup.enter='login()'>
			<!--login button-->
				<v-btn v-if="this.flag" dense class='dizagara-button-blue'
					style='width: 100%; margin: 0px 0px 10px 0px; font-weight: bold;'
					@click='login()'>
					<span v-if="this.flag" class='mdi' id='loginIcon'></span>
					LOGIN
				</v-btn>
				<v-row class = "align-center">
			<!--register button-->
				<v-btn small class='dizagara-button-blue'
					style='margin: 10px; width: 190px' 
					@click="register()" 
					title='Create an account'>
					<span class='mdi' id='accountIcon'></span>
					REGISTER
				</v-btn>
			<!--recover password-->
				<v-btn small class='dizagara-button-blue'
					style='margin: 10px; width: 190px;' 
					@click='recover()' 
					title='Recover your password.'>
					<span class='mdi' id='passwordIcon'></span>
					PASSWORD
				</v-btn>
				</v-row>
			</v-card-text>
		</v-card-actions>
		</v-card>
		</v-form>
	</v-app>
</template>
<script>
//import
	import bridge from '../bridge.js';
	import references from '../utils/references.js';
	import user from './user.vue';
	import toastr from 'toastr';

//master
    export default {
//name
	name: 'login',
//components
	components: {
		user
	},
//cycle methods
	//created
		async created(){
		//init timeout 
			setTimeout(() => {
				$('#firstFocus').focus();
				$('#loginIcon').addClass(references.getIcon('login'));
				$('#accountIcon').addClass(references.getIcon('user'));
				$('#passwordIcon').addClass(references.getIcon('password'));
			}, 0);
		//CRUD examples (for reference only)
			//create
				await bridge.setDocument({
					collection: `users`,
					item: {
						_id: `id01`,
						field01: `field01`,
						field02: `field02`,
						field03: `field03`
					}
				});
			//read
				let read = await bridge.getDocument({
					collection: `users`,
					item: {
						_id: `id01`
					}
				});
				console.log(read);
			//update
				await bridge.setDocument({
					collection: `users`,
					item: {
						_id: `id01`,
						field01: `modedField01`,
						field02: `modedField02`,
						field03: `modedField03`
					}
				});

			//delete
				await bridge.deleteDocument({
					collection: `users`,
					item: {
						_id: `id01`
					}
				});
		},
//custom methods
	methods: {
	//login
		async login(){
			//validate entries
				if(!this.$refs.form.validate()){
					return;
				}
			//get access token
				let token = await bridge.getToken({
					collection: `users`,
					item: {
						_id: this.username,
						fruit: this.fruit
					}
				});
				console.log(token)
			//notify based on the token
				if (token == "user doesn't exist") {
					toastr.error(`Username does not exist!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
					this.numFailedLogins++;
					if (this.numFailedLogins >= 5) {
						this.flag = false;
						toastr.error(`Too many login attempts have been made!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
					}
				}
				else if (token == "invalid password") {
					toastr.error(`Password is incorrect!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
					this.numFailedLogins++;
					if (this.numFailedLogins >= 5) {
						this.flag = false;
						toastr.error(`Too many login attempts have been made!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
					}
				}
			//redirect if successful token
				else {
					this.$router.push({ path: `/dashboard/${this.username}`});
					this.numFailedLogins = 0;
					this.flag = true;
				}
		},
	//create account
		register(){
			this.dialogs.user.show = true;
		},
	//forgot password
		recover(){
			toastr.info(`Ignore this button, no coding required here!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
		},
	//dialogs
		async closeDialog(params, type){
			this.dialogs[type].show = false;
			//save user to database
			if (params.action == "submit") {
				await bridge.setUser({
					collection: `users`,
					item: {
						_id: params.data.username,
						fruit: params.data.fruit,
					}
				});
			//notify
				toastr.success(`Account successfully created!`, ``, {'closeButton': true, positionClass: `toast-bottom-right`});
			}
		}
	},
//global vars
	data: () => ({
	// tracks number of failed logins
		numFailedLogins: 0,
	// flag is set to false when numFailedLogins >= 5
		flag: true,
		username: '',
		fruit: '',
		user: {},
		validate: {
			required: a => !!a || 'Entry required!'
		},
		params: {},
		dialogs: {
			user: {
				show: false
			}
		}
	}),
}
</script>