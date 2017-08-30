const functions = require('firebase-functions');

'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');
const admin = require('firebase-admin');

//************************Email things
const path = require('path');
const async = require('async');

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
admin.initializeApp(functions.config().firebase);
// const gmailEmail = encodeURIComponent(functions.config().gmail.email);
// const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(smtpTransport({
		service: 'gmail',
		auth: {
				xoauth2: xoauth2.createXOAuth2Generator({
						user: 'raintehnology@gmail.com',
						clientId: '624769107460-5gk5bqs7drestoj0bupuvmh1fo6da17c.apps.googleusercontent.com',
						clientSecret: 'PCS6jjblUpV5LBJSR3_aU9EX',
						refreshToken: '1/IP1QAc4DlokufMCDDy9WW2rT80j0Y3-RM4CzjgGAt1WWSPnUnCXz7VRC2fiIpHby'
				})
		}
}));

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/mailObj').onWrite(event => {
		const snapshot = event.data;
		let resultObjArr = [];
		console.log('snap is: ', snapshot);
		const val = snapshot.val();
		console.log('val is: ', val);
		const db = admin.database();
		let ref = db.ref('/columns');
		let goalObj;
		ref.once("value", (data) => {
				let readableData = data.val();
				console.log('readData: ', readableData);
				val.itemIdxArr.forEach(item => {
						console.log('item: ', item);
						let goalObj = data.child(item).val();
						//let goalObj = readableData.filter(function(){obj => obj.id === item})[0];
						console.log('goalObj: ', goalObj);
						resultObjArr.push(goalObj);

                    console.log('obj to template ', resultObjArr);
                    const mailOptions = {
                        from: 'raintehnology@gmail.com',
                        to: `${val.email}`,
                        subject: `${val.subject}`,
                        html: giveMeTemplate(goalObj),
                        // text: `<div><h2>Subject is: ${val.subject}</h2><p>Here is some text for ${val.email}:</p><p>${val.text}</p><p>${resultObjArr}</p></div>`
                    };

                    return mailTransport.sendMail(mailOptions)
                        .then(() => console.log('New subscription confirmation email sent to:', val.email))
                        .catch(error => console.log('error is: ', error));
				})
		})
				.then(result => console.log('result is: ', result))
				.catch(error => console.log('error is: ', error));



		//html: `<div><h2>Subject is: ${val.subject}</h2><p>Here is some text for ${val.email}:</p><p>${val.text}</p><p>${resultObjArr}</p></div>`

		// return mailTransport.sendMail(mailOptions)
		// 		.then(() => console.log('New subscription confirmation email sent to:', val.email))
		// 		.catch(error => console.log('error is: ', error));
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


function giveMeTemplate(itemArray) {
		return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<title>Underscore-Responsive Email Template</title>
				<style type="text/css">
						/* Client-specific Styles */
						#outlook a {padding:0;} /* Force Outlook to provide a "view in browser" menu link. */
						body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
						/* Prevent Webkit and Windows Mobile platforms from changing default font sizes, while not breaking desktop design. */
						.ExternalClass {width:100%;} /* Force Hotmail to display emails at full width */
						.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing. */
						#backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
						img {outline:none; text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}
						a img {border:none;}
						.image_fix {display:block;}
						p {margin: 0px 0px !important;}
						table td {border-collapse: collapse;}
						table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
						a {color: #33b9ff;text-decoration: none;text-decoration:none!important;}
						/*STYLES*/
						table[class=full] { width: 100%; clear: both; }
						.imgpop {font-size: 30px; color: white;}
						/*IPAD STYLES*/
						@media only screen and (max-width: 640px) {
						a[href^="tel"], a[href^="sms"] {
						text-decoration: none;
						color: #0a8cce; /* or whatever your want */
						pointer-events: none;
						cursor: default;
				}
						.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
						text-decoration: default;
						color: #0a8cce !important;
						pointer-events: auto;
						cursor: default;
				}
						table[class=devicewidth] {width: 440px!important;text-align:center!important;}
						table[class=devicewidthmob] {width: 420px!important;text-align:center!important;}
						table[class=devicewidthinner] {width: 420px!important;text-align:center!important;}
						img[class=banner] {width: 440px!important;height:157px!important;}
						img[class=col2img] {width: 440px!important;height:330px!important;}
						table[class="cols3inner"] {width: 100px!important;}
						table[class="col3img"] {width: 131px!important;}
						img[class="col3img"] {width: 131px!important;height: 82px!important;}
						table[class='removeMobile']{width:10px!important;}
						img[class="blog"] {width: 420px!important;height: 162px!important;}
				}

						/*IPHONE STYLES*/
						@media only screen and (max-width: 480px) {
						a[href^="tel"], a[href^="sms"] {
						text-decoration: none;
						color: #0a8cce; /* or whatever your want */
						pointer-events: none;
						cursor: default;
				}
						.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
						text-decoration: default;
						color: #0a8cce !important;
						pointer-events: auto;
						cursor: default;
				}
						table[class=devicewidth] {width: 280px!important;text-align:center!important;}
						table[class=devicewidthmob] {width: 260px!important;text-align:center!important;}
						table[class=devicewidthinner] {width: 260px!important;text-align:center!important;}
						img[class=banner] {width: 280px!important;height:100px!important;}
						img[class=col2img] {width: 280px!important;height:210px!important;}
						table[class="cols3inner"] {width: 260px!important;}
						img[class="col3img"] {width: 280px!important;height: 175px!important;}
						table[class="col3img"] {width: 280px!important;}
						img[class="blog"] {width: 260px!important;height: 100px!important;}
						td[class="padding-top-right15"]{padding:15px 15px 0 0 !important;}
						td[class="padding-right15"]{padding-right:15px !important;}
				}
				</style>
		</head>
		<body>

		<table width="100%" bgcolor="#dbdbdb" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="preheader" >
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
																<!-- Spacing -->
																<tr>
																		<td width="100%" height="10"></td>
																</tr>
			
										</tr>
										<tr>
												<td width="100%" height="10"></td>
										</tr>

										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>
		</td>
		</tr>
</tbody>
</table>
	
		<table width="100%" bgcolor="#d8d8d8" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="header">
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#303030" width="560" cellpadding="0" cellspacing="0" border="0" align="center" style="border-top-left-radius:5px;border-top-right-radius:5px;" class="devicewidth">
																<tbody>
								
																<tr>
																		<td height="10" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
								
																<tr>
																		<td>
										
																				<table width="194" align="left" border="0" cellpadding="0" cellspacing="0">
																						<tbody>
																						<tr>
																								<td width="20"></td>
																								<td width="174" height="60" align="left">
																										<div class="imgpop">
																												Items for sale
																										</div>
																								</td>
																						</tr>
																						</tbody>
																				</table>
												
																		</td>
																</tr>
											
																<tr>
																		<td height="10" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
				
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>

		<table width="100%" bgcolor="#d8d8d8" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="left-image">
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#ffffff" width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
					
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
					
																<tr>
																		<td>
																				<table width="520" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																						<tbody>
																						<tr>
																								<td>
																
																										<table width="200" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">
																												<tbody>
															
																												<tr>
																														<td width="200" height="150" align="center" class="devicewidth">
																																<img src="img/leftimg.jpg" alt="" border="0" width="200" height="150" style="display:block; border:none; outline:none; text-decoration:none;" class="col2img">
																														</td>
																												</tr>
																
																												</tbody>
																										</table>
												
																										<table align="left" border="0" cellpadding="0" cellspacing="0" class="mobilespacing">
																												<tbody>
																												<tr>
																														<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																												</tr>
																												</tbody>
																	
																										<table width="300" align="right" border="0" cellpadding="0" cellspacing="0" class="devicewidthmob">
																												<tbody>
																												<tr>
																														<td style="font-family: Helvetica, arial, sans-serif; font-size: 18px; color: #2d2a26; text-align:left; line-height: 24px;" class="padding-top-right15">
																																Your Heading Goes Here
																														</td>
																												</tr>
																				
																												<tr>
																														<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																												</tr>
																					
																												<tr>
																														<td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #7a6e67; text-align:left; line-height: 24px;" class="padding-right15">
																																Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
																																tempor incididunt ut labore et dolore magna
																														</td>
																												</tr>
																		
																												</tbody>
																										</table>
																			
																								</td>
																						</tr>
																						</tbody>
																				</table>
																		</td>
																</tr>
						
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
									
																<tr>
																		<td height="5" bgcolor="#2d2a26" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
							
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>

		<table width="100%" bgcolor="#d8d8d8" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="left-image">
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#ffffff" width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
								
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
										
																<tr>
																		<td>
																				<table width="520" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																						<tbody>
																						<tr>
																								<td>
																										<!-- Start of left column -->
																										<table width="200" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">
																												<tbody>
																		
																												<tr>
																														<td width="200" height="150" align="center" class="devicewidth">
																																<img src="img/leftimg.jpg" alt="" border="0" width="200" height="150" style="display:block; border:none; outline:none; text-decoration:none;" class="col2img">
																														</td>
																												</tr>
																			
																												</tbody>
																										</table>
																							
																										<table align="left" border="0" cellpadding="0" cellspacing="0" class="mobilespacing">
																												<tbody>
																												<tr>
																														<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																												</tr>
																												</tbody>
																										</table>
																						
																										<table width="300" align="right" border="0" cellpadding="0" cellspacing="0" class="devicewidthmob">
																												<tbody>
																												<tr>
																														<td style="font-family: Helvetica, arial, sans-serif; font-size: 18px; color: #2d2a26; text-align:left; line-height: 24px;" class="padding-top-right15">
																																Your Heading Goes Here
																														</td>
																												</tr>
																							
																												<tr>
																														<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																												</tr>
																					
																												<tr>
																														<td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #7a6e67; text-align:left; line-height: 24px;" class="padding-right15">
																																Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
																																tempor incididunt ut labore et dolore magna
																														</td>
																												</tr>
																	
																												</tbody>
																										</table>
															
																								</td>
																						</tr>
																						</tbody>
																				</table>
																		</td>
																</tr>
											
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
												
																<tr>
																		<td height="5" bgcolor="#2d2a26" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
								
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>

		<table width="100%" bgcolor="#d8d8d8" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="left-image">
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#ffffff" width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
								
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
								
																<tr>
																		<td>
																				<table width="520" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidthinner">
																						<tbody>
														
																						<tr>
																								<td width="520" align="center" class="devicewidthinner">
																										<img src="img/blog.jpg" alt="" border="0" width="520" height="200" style="display:block; border:none; outline:none; text-decoration:none;" class="blog">
																								</td>
																						</tr>
																		
																						<tr>
																								<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																						</tr>
												
																						<tr>
																								<td style="font-family: Helvetica, arial, sans-serif; font-size: 18px; color: #2d2a26; text-align:left; line-height: 24px;">
																										Your Heading Goes Here
																								</td>
																						</tr>
												
																						<tr>
																								<td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																						</tr>
																
																						<tr>
																								<td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #7a6e67; text-align:left; line-height: 24px;">
																										Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
																										tempor incididunt ut labore et dolore magna
																								</td>
																						</tr>
								
																						</tbody>
																				</table>
																		</td>
																</tr>
												
																<tr>
																		<td height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
											
																<tr>
																		<td height="5" bgcolor="#2d2a26" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
									
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>
	
		<table width="100%" bgcolor="#d8d8d8" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="footer">
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#303030" width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
																<!-- Spacing -->
																<tr>
																		<td height="10" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
																<!-- Spacing -->
																<tr>
																		<td>
																				<!-- logo -->
																				<table width="194" align="left" border="0" cellpadding="0" cellspacing="0">
																						<tbody>
																						<tr>
																								<td width="20"></td>
																								<td width="174" height="40" align="left">
																										<div class="imgpop">
																												<a target="_blank" href="#">
																														<img src="img/logo.png" alt="" border="0" width="174" height="21" style="display:block; border:none; outline:none; text-decoration:none;">
																												</a>
																										</div>
																								</td>
																						</tr>
																						</tbody>
																				</table>
															
																				<table width="60" height="40" align="right" vaalign="middle"  border="0" cellpadding="0" cellspacing="0">
																						<tbody>
																						<tr>
																								<td width="22" height="22" align="left">
																										<div class="imgpop">
																												<a target="_blank" href="#">
																														<img src="img/facebook.png" alt="" border="0" width="22" height="22" style="display:block; border:none; outline:none; text-decoration:none;">
																												</a>
																										</div>
																								</td>
																								<td align="left" width="10" style="font-size:1px; line-height:1px;">&nbsp;</td>
																								<td width="22" height="22" align="right">
																										<div class="imgpop">
																												<a target="_blank" href="#">
																														<img src="img/twitter.png" alt="" border="0" width="22" height="22" style="display:block; border:none; outline:none; text-decoration:none;">
																												</a>
																										</div>
																								</td>
																								<td align="left" width="20" style="font-size:1px; line-height:1px;">&nbsp;</td>
																						</tr>
																						</tbody>
																				</table>
												
																		</td>
																</tr>
												
																<tr>
																		<td height="10" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>
																</tr>
												
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>

		<table width="100%" bgcolor="#dbdbdb" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="preheader" >
				<tbody>
				<tr>
						<td>
								<table width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
										<tbody>
										<tr>
												<td width="100%">
														<table bgcolor="#ffffff" width="560" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">
																<tbody>
																<tr>
																		<td width="100%" height="10"></td>
																</tr>

																<tr>
																		<td align="center" valign="middle" style="font-family: Helvetica, arial, sans-serif; font-size: 13px;color: #7a6e67;text-align:center;" st-content="viewonline">
																				If you wish not to receive further updates.Please
																				<a href="#" style="text-decoration: none; color: #303030">Unsubscribe</a>
																		</td>
																</tr>
				
																<tr>
																		<td width="100%" height="10"></td>
																</tr>
												
																</tbody>
														</table>
												</td>
										</tr>
										</tbody>
								</table>
						</td>
				</tr>
				</tbody>
		</table>
	

</body>
</html>`

}