<input id="PAGE_ID" type="hidden" name="PAGE_ID" value="existingAccount">
<div class="" id="loginModal" for="window" onunload="alert('OnUNLOAD FIRED-------------------');">
	<div class="modal-header">
		<input id="USER_ID" type="hidden" name="USER_ID" value="<?php echo $userRecord->id; ?>">
		<input id="IMAGE_ID" type="hidden" name="IMAGE_ID" value="<?php echo $userRecord->imageId; ?>">
		<input id="IMAGE_SERIES" type="hidden" name="IMAGE_SERIES" value="<?php echo '0'; ?>">


		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h3><?php echo $fullName;?>'s Account Information</h3>
	</div>
	<div class="modal-body">
		<div class="well">
			<ul class="nav nav-tabs">				
				<li class="active"><a href="<?php echo URL; ?>account" data-toggle="tab">Your Account</a></li>				
				<li><a href="<?php echo URL; ?>account/friends"  data-toggle="tab">Friends</a></li>
				<li ><a href="<?php echo URL; ?>account/friendsearch"  data-toggle="tab">Friend Search</a></li>
				<li><a href="<?php echo URL; ?>account/privacy"  data-toggle="tab">Privacy</a></li>
			</ul>
			<div id="myTabContent" class="tab-content">
				<div class="tab-pane active in" id="login">
					<form class="form-horizontal" action='<?php echo URL; ?>login/getuserdata' method="POST">
						<fieldset>
							<div id="legend">
								<legend class="">All About You</legend><input type="file" id="bt_browseFile" name="bt_browseFile" class="hide_file" onchange="console.log('hiddenFile !!!!');"></input>
							</div>    
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="firstName">First Name</label>
								<div class="controls">
									<input type="text" id="firstName" name="firstName" placeholder="" class="input-xlarge" value="<?php echo $userRecord->fName; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="lastName">Last Name</label>
								<div class="controls">
									<input type="text" id="lastName" name="lastName" placeholder="" class="input-xlarge" value="<?php echo $userRecord->lName; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="screenName">Screen Name</label>
								<div class="controls">
									<input type="text" id="screenName" name="screenName" placeholder="" class="input-xlarge" value="<?php echo $userRecord->userName; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="emailAddress">Email Address</label>
								<div class="controls">
									<input type="text" id="emailAddress" name="emailAddress" placeholder="" class="input-xlarge" value="<?php echo $userRecord->emailAddress; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="city">City</label>
								<div class="controls">
									<input type="text" id="city" name="city" placeholder="" class="input-xlarge" value="<?php echo $userRecord->city; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="state">State</label>
								<div class="controls">
									<input type="text" id="state" name="state" placeholder="" class="input-xlarge" value="<?php echo $userRecord->state; ?>">
								</div>
							</div>																												
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="country">Country</label>
								<div class="controls">
									<input type="text" id="country" name="country" placeholder="" class="input-xlarge" value="<?php echo $userRecord->country; ?>">
								</div>
							</div>
							<div class="control-group">
								<!-- Username -->
								<label class="control-label"  for="imagePlace">Your Image</label>
								<div class="controls">									
									<img id="imagePlace" name="imagePlace" placeholder="" class="input-xlarge"  alt="sss" src= "<?php echo $userRecord->file; ?>"> <br>
								</div>
							</div>
							
							<div class="control-group">																					
								<div class="control-group">
								<!-- Password-->
								<label class="control-label"  for="screenImage"></label>
								<div class="controls">
									<div>											
										<button class="btn btn-xs btn-primary" type="button" id="fileUpload" name="fileUpload" onClick="console.log('brows clicked!!!');">Browse</button>
									</div>	
								</div>								

							</div>



							</div>
							
																																										
							
							
							<div class="control-group">
								<!-- Button -->
								<div class="controls">
									
									

								</div>
							</div>
						</fieldset>
					</form>                
				</div>
				
			</div>
		</div>
	</div>