<div id="post-box">

	<form action="http://localhost:3000/posts/add" method="post" role="form" enctype="multipart/form-data" class="facebook-share-box">
		 <div class="share">
			 <div class="arrow"></div>
			 <div class="panel panel-default">
        <div class="panel-heading"><i class="fa fa-file"></i> Update Status</div>
        <div class="panel-body">
          <div class="">
          	<input type="hidden" name="user_id" value="<?php echo $my_id; ?>">
            <textarea name="text" cols="40" rows="10" class="form-control message" style="height: 62px; overflow: hidden;" placeholder="What's on your mind ?"></textarea> 
            <input type="file" name="postPhoto" id="postPhoto" style="display:none">
				</div>
        </div>
			 <div class="panel-footer">
				 <div class="row">
					 <div class="col-md-7">
						 <div class="form-group">
						 <div class="btn-group">
						   <button type="button" class="btn btn-default" id="browsePostPhoto"><i class="icon icon-picture"></i> Photo</button>
						 	</div>
						 </div>
						 </div>
						 <div class="col-md-5">
						 <div class="form-group">                         
						 <input type="submit" name="submit" value="Post" class="btn btn-primary pull-right">                               
						 </div>
						 </div>
						 </div>
					 </div>
          </div>
			 </div>
		 </div>
	 </form>
</div>